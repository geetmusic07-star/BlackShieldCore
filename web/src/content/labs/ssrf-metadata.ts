import type { LabProfile } from "./types";

export const SSRF_METADATA: LabProfile = {
  key: "ssrf-metadata",
  target: "webhook.acme.local/test",
  flag: "BSC{metadata_is_a_blast_radius}",
  practicalKind: "ssrf",
  category: "Cloud / Server-Side Forgery",
  mitre: "MITRE T1190 · T1552.005",
  chapters: [
    {
      number: 1,
      title: "Introduction",
      kind: "briefing",
      minutes: 4,
      body: [
        {
          kind: "p",
          value:
            "Server-Side Request Forgery is the bug class where an attacker convinces the server to make HTTP requests on its behalf - to URLs the attacker, not the public internet, controls. It has been on the OWASP Top 10 since 2021, and it is one of the most consequential bugs in any application that runs in a cloud environment.",
        },
        {
          kind: "p",
          value:
            "The reason cloud changes everything is straightforward: every major cloud provider runs an instance metadata service reachable only from inside the VM. AWS, GCP, and Azure all do this - and they all expose temporary credentials for the IAM role attached to the instance. An SSRF that can reach 169.254.169.254 doesn't just leak data; it gives the attacker the same permissions as the application itself.",
        },
        { kind: "h3", value: "Learning objectives" },
        {
          kind: "ul",
          items: [
            "Recognise SSRF in unfamiliar shapes - image fetchers, webhooks, PDF generators, oEmbed previews",
            "Understand cloud metadata services and what they expose",
            "Compare IMDSv1 (insecure-by-default) and IMDSv2 (token-protected)",
            "Bypass naive URL filters with IP encodings, redirects, and DNS rebinding",
            "Use leaked IAM role tokens for lateral movement",
            "Capture cloud credentials in the practical and exfil the flag",
          ],
        },
        { kind: "h3", value: "Prerequisites" },
        {
          kind: "p",
          value:
            "Comfort reading HTTP requests and a rough idea of what an IAM role is will help. Cloud-native experience isn't required - the metadata patterns are explained as we go.",
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "Estimated time: 60 minutes. Chapter 4 (bypasses) is dense - read it carefully even if you've seen SSRF before.",
        },
      ],
      questions: [
        {
          prompt: "I have read the briefing and am cleared to begin.",
          answer: "",
          placeholder: "No answer needed - just acknowledge",
          xp: 5,
        },
      ],
    },

    {
      number: 2,
      title: "Anatomy of an SSRF",
      kind: "mechanics",
      minutes: 6,
      body: [
        {
          kind: "p",
          value:
            "SSRF lives wherever the server fetches a URL the client supplied. The triad you're looking for in a code review or a bug-bounty target is simple:",
        },
        {
          kind: "ul",
          items: [
            "A user-controlled URL (or hostname, or path component that becomes part of one)",
            "A server-side fetcher (HTTP client, library, headless browser)",
            "Insufficient validation between the two",
          ],
        },
        { kind: "h3", value: "Five common shapes" },
        {
          kind: "ul",
          items: [
            "Image preview fetchers - 'paste a URL, we'll show you a thumbnail'",
            "Webhook senders - 'send notifications to this URL on these events'",
            "PDF / screenshot generators - server runs headless Chrome on a URL you provide",
            "oEmbed and link-preview unfurlers - server fetches metadata for any pasted link",
            "Federation, SSO, and SAML callbacks - server fetches a JWKS or metadata document",
          ],
        },
        {
          kind: "code",
          value:
            'POST /preview HTTP/1.1\nContent-Type: application/json\n\n{\n  "url": "http://attacker.com/poster.jpg"\n}',
        },
        { kind: "h3", value: "Why it's dangerous" },
        {
          kind: "p",
          value:
            "Anatomy of the bug: the server sees attacker.com and trusts it. But the attacker can write http://localhost:6379 instead - that's the Redis port on the same machine. Or http://169.254.169.254/... - cloud metadata. Or http://internal-api.svc.cluster.local/admin - a service inside the same Kubernetes cluster that's normally unreachable from outside.",
        },
        {
          kind: "p",
          value:
            "The naive defense - 'block private IPs' - fails for reasons we'll cover in Chapter 4. The architectural defense - outbound network policy that disallows reaching internal addresses from the fetcher - works, but is rarely in place.",
        },
        {
          kind: "callout",
          tone: "redflag",
          value:
            "Every 'fetch a URL the user gave us' feature is potentially SSRF. The question is never 'does this app have SSRF?' - it's 'what can the SSRF reach?'.",
        },
      ],
      questions: [
        {
          prompt: "What does the SSRF abbreviation stand for? (initialism - full phrase)",
          answer: "server side request forgery",
          placeholder: "full phrase",
          xp: 15,
        },
        {
          prompt: "Which port number does Redis listen on by default?",
          answer: "6379",
          placeholder: "port number",
          hint: "Often probed via SSRF for unauthenticated access.",
          xp: 15,
        },
        {
          prompt:
            "Headless ___ generators are a common SSRF surface. (one word - what kind of headless software?)",
          answer: "chrome",
          placeholder: "browser",
          xp: 10,
        },
      ],
    },

    {
      number: 3,
      title: "The Cloud Metadata Service",
      kind: "mechanics",
      minutes: 8,
      body: [
        {
          kind: "p",
          value:
            "Every AWS EC2 instance can reach a service at the link-local IP 169.254.169.254. This service is unauthenticated by design - anyone running on the instance can hit it - and it exposes:",
        },
        {
          kind: "ul",
          items: [
            "Instance ID, region, availability zone",
            "Network configuration",
            "User data (often containing bootstrap scripts, sometimes containing secrets)",
            "IAM role temporary credentials (the prize)",
          ],
        },
        { kind: "h3", value: "The credential exchange" },
        {
          kind: "p",
          value:
            "If the EC2 instance has an IAM role attached - and most do, since it's the recommended way to grant cloud permissions - the metadata service hands out temporary credentials for that role to anyone who asks:",
        },
        {
          kind: "code",
          value:
            "GET http://169.254.169.254/latest/meta-data/iam/security-credentials/\n  → MyAppRole\n\nGET http://169.254.169.254/latest/meta-data/iam/security-credentials/MyAppRole\n  → {\n      \"AccessKeyId\": \"ASIA...\",\n      \"SecretAccessKey\": \"...\",\n      \"Token\": \"...\",\n      \"Expiration\": \"...\"\n    }",
        },
        {
          kind: "p",
          value:
            "These credentials are valid for ~6 hours. An attacker who exfils them can impersonate the application - read S3 buckets the role can read, invoke Lambdas it can invoke, decrypt KMS keys it can use. The blast radius is whatever IAM said the application could do.",
        },
        { kind: "h3", value: "IMDSv1 vs IMDSv2" },
        {
          kind: "p",
          value:
            "AWS introduced IMDSv2 in 2019 specifically to mitigate this attack class. IMDSv2 requires a session token, obtained via a PUT request:",
        },
        {
          kind: "code",
          value:
            'PUT http://169.254.169.254/latest/api/token\nX-aws-ec2-metadata-token-ttl-seconds: 21600\n  → <token>\n\nGET http://169.254.169.254/latest/meta-data/...\nX-aws-ec2-metadata-token: <token>\n  → ...',
        },
        {
          kind: "p",
          value:
            "The PUT requirement defeats most SSRF chains, since typical SSRF can do GET but not PUT. But:",
        },
        {
          kind: "ul",
          items: [
            "IMDSv1 was not deprecated - it's still on by default unless you opt out",
            "Some SSRF chains do support PUT (when the user can specify HTTP method)",
            "IMDSv2 still requires an extra hop, but is still vulnerable if the SSRF supports both PUT and GET",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "The Capital One 2019 breach demonstrated that an SSRF with PUT support can still steal credentials even from IMDSv2. The hard mitigation is hop-limit set to 1 - even tokens can't be obtained from outside the local network namespace.",
        },
        { kind: "h3", value: "Other clouds" },
        {
          kind: "p",
          value:
            "GCP uses metadata.google.com (also reachable as 169.254.169.254). Azure uses 169.254.169.254. The specifics differ - required headers, path structure - but the pattern is identical. Reaching the link-local IP from inside a cloud VM is rarely something a benign service needs to do.",
        },
      ],
      questions: [
        {
          prompt:
            "What link-local IPv4 address hosts the AWS instance metadata service?",
          answer: "169.254.169.254",
          placeholder: "IP address",
          xp: 20,
        },
        {
          prompt: "What does IMDS stand for? (initialism - full phrase)",
          answer: "instance metadata service",
          placeholder: "three words",
          xp: 20,
        },
        {
          prompt:
            "IMDSv2 requires which HTTP method to obtain a session token?",
          answer: "put",
          placeholder: "HTTP verb",
          hint: "Three letters. Used to update resources.",
          xp: 15,
        },
      ],
    },

    {
      number: 4,
      title: "Bypasses & Filter Evasion",
      kind: "threat",
      minutes: 9,
      body: [
        {
          kind: "p",
          value:
            "Application teams faced with the metadata threat usually reach for the simplest defense first: 'block 169.254.169.254 in the URL'. This defense fails almost immediately when the attacker knows the tricks. The remainder of this chapter is the catalogue of those tricks - read carefully, because the practical depends on at least one of them.",
        },
        { kind: "h3", value: "IP encoding" },
        {
          kind: "p",
          value:
            "169.254.169.254 has an alarming number of equivalent representations. A URL parser will canonicalise some, but a hostname comparator that matches strings will miss most:",
        },
        {
          kind: "ul",
          items: [
            "Decimal: 2852039166",
            "Octal: 0250.0376.0250.0376",
            "Hex: 0xa9.0xfe.0xa9.0xfe - or compact 0xa9fea9fe",
            "IPv6 mapped: [::ffff:169.254.169.254]",
            "Compressed mixed: 0:0:0:0:0:ffff:a9fe:a9fe",
            "Variable-format: leading zeros, mixed bases, embedded user info",
          ],
        },
        {
          kind: "p",
          value:
            "A naive url.includes('169.254') misses every one of these. The attacker sends http://2852039166/... and the server's HTTP client resolves it to the metadata IP all the same.",
        },
        { kind: "h3", value: "DNS-based" },
        {
          kind: "p",
          value:
            "Register metadata.attacker.com with an A record pointing to 169.254.169.254. http://metadata.attacker.com/ is now a hostname-based path to the metadata service. The naive filter sees a public hostname and lets it through; the resolver returns the link-local IP, and the request goes to the metadata service.",
        },
        { kind: "h3", value: "DNS rebinding" },
        {
          kind: "p",
          value:
            "This one's vicious. The attacker registers evil.com with a TTL of 0. The first DNS resolution returns a public IP - passes the filter, which checks the resolved IP. Between the filter check and the HTTP fetch, the attacker rotates the DNS to return 169.254.169.254. The second resolution (during fetch) hits the metadata IP. Time-of-check vs time-of-use; classic race.",
        },
        { kind: "h3", value: "Redirects" },
        {
          kind: "p",
          value:
            "Some SSRF chains use HTTP clients that follow redirects by default. The attacker hosts http://evil.com/redirect returning a 302 to http://169.254.169.254/.... Filter checks evil.com, lets it through. Client follows redirect, hits metadata.",
        },
        { kind: "h3", value: "Open-redirect chaining" },
        {
          kind: "p",
          value:
            "Even if the target validates against an allow-list of trusted domains, an open redirect on one of those trusted domains turns the SSRF into an unrestricted fetch. The classic example is a third-party login page's redirect_uri parameter that doesn't validate its own destination.",
        },
        { kind: "h3", value: "URL-userinfo and parser confusion" },
        {
          kind: "ul",
          items: [
            "@-injection: http://allowed.com@169.254.169.254/ - many parsers treat allowed.com as user info and route to the second host",
            "Path confusion: http://169.254.169.254#@allowed.com - varies by parser, occasionally enough",
            "Differential parsing: backend X parses one host, backend Y parses another, request goes through both",
          ],
        },
        {
          kind: "callout",
          tone: "redflag",
          value:
            "There is no naive filter that catches all of these. The only robust defense is network policy - the host running the fetcher must not be able to reach link-local addresses, full stop.",
        },
      ],
      questions: [
        {
          prompt:
            "What attack uses a DNS TTL race to swap a benign hostname for a sensitive IP between filter and fetch? (two words)",
          answer: "dns rebinding",
          placeholder: "two words",
          xp: 25,
        },
        {
          prompt:
            "What's the decimal-form IP address of the metadata service?",
          answer: "2852039166",
          placeholder: "decimal number",
          hint: "It's just 169.254.169.254 expressed as a single 32-bit integer.",
          xp: 20,
        },
        {
          prompt:
            "What URL-userinfo character lets attackers smuggle a target host past hostname filters?",
          answer: "@",
          placeholder: "single character",
          xp: 15,
        },
      ],
    },

    {
      number: 5,
      title: "Stealing Credentials & Lateral Movement",
      kind: "threat",
      minutes: 8,
      body: [
        {
          kind: "p",
          value:
            "You've got an SSRF. You've reached 169.254.169.254. The metadata service returned IAM credentials. What now? These credentials are normal AWS credentials - the same shape you'd get from running aws configure. With aws-cli they slot in directly:",
        },
        {
          kind: "code",
          value:
            "aws configure set aws_access_key_id ASIA...\naws configure set aws_secret_access_key ...\naws configure set aws_session_token ...\n\naws sts get-caller-identity\n  → Account: 123456789012\n  → Arn:     arn:aws:sts::123456789012:assumed-role/MyAppRole/i-abc123",
        },
        {
          kind: "p",
          value:
            "What the attacker does next depends entirely on what IAM said the role could do. The role's policy is the blast radius:",
        },
        {
          kind: "ul",
          items: [
            "S3 enumeration: aws s3 ls lists every bucket the role can reach. In a misconfigured account this often includes 'private' backup buckets containing database dumps.",
            "Lambda enumeration: aws lambda list-functions reveals every function the role can read or invoke. Functions often have hardcoded secrets in environment variables visible via get-function-configuration.",
            "SSM Parameter Store: aws ssm describe-parameters lists every parameter the role can see. Production database URLs and third-party API keys end up here.",
            "KMS: if the role has kms:Decrypt, encrypted secrets in any of the above stores can be decrypted directly.",
          ],
        },
        { kind: "h3", value: "Lateral movement" },
        {
          kind: "p",
          value:
            "If the role can iam:CreateUser or sts:AssumeRole more privileged roles, the attacker pivots to broader access. Capital One's 2019 incident escalated from a single SSRF to 100 million records exfiltrated this way - not because the SSRF was novel, but because the role IMDS handed out had permissions far beyond what the application actually needed.",
        },
        { kind: "h3", value: "Why the blast radius is usually large" },
        {
          kind: "p",
          value:
            "Most applications don't need most of the permissions their role has. IAM least-privilege is a discipline, not a default. A role granted 'ReadOnlyAccess' out of laziness gives the attacker the keys to every readable resource in the account - and 'ReadOnly' includes secrets in SSM and Secrets Manager.",
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "AWS GuardDuty can spot when EC2 credentials are used from outside the EC2 environment they were issued to. Disciplined attackers run their commands from another EC2 instance to avoid this signature - defenders should know this so they're not lulled by GuardDuty's silence.",
        },
      ],
      questions: [
        {
          prompt:
            "What AWS service stores hierarchical configuration values (and often production secrets)? (initialism)",
          answer: "ssm",
          placeholder: "abbreviation",
          hint: "Three letters. Stands for 'Systems Manager' Parameter Store.",
          xp: 20,
        },
        {
          prompt:
            "Which AWS detection service flags credentials used from outside their origin instance?",
          answer: "guardduty",
          placeholder: "service name",
          xp: 20,
        },
        {
          prompt:
            "Which IAM action would let an attacker decrypt encrypted secrets? (one word)",
          answer: "decrypt",
          placeholder: "action verb",
          hint: "It's a KMS API and an IAM permission of the same name.",
          xp: 20,
        },
      ],
    },

    {
      number: 6,
      title: "Practical: Capture the Metadata Credentials",
      kind: "exploit",
      minutes: 25,
      body: [
        {
          kind: "p",
          value:
            "Time to put it together. The target is a webhook tester: it accepts a URL via POST, fetches that URL server-side, and returns the response body. Boot the lab below and probe what the fetcher can reach.",
        },
        { kind: "h3", value: "Your task" },
        {
          kind: "ul",
          items: [
            "Probe the network reachable from the fetcher - what services respond?",
            "Find the cloud metadata service and the role attached to the instance",
            "Retrieve the IAM credentials issued for that role",
            "Use the credentials to reach a final 'crown-jewel' endpoint and capture the flag",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "The webhook fetcher follows redirects but blocks the literal string 169.254 in the URL it's given. Re-read Chapter 4 if you need to remember what to do about that. The flag is in the BSC{...} format.",
        },
      ],
      questions: [
        {
          prompt: "Submit the captured flag to complete the room.",
          answer: "BSC{metadata_is_a_blast_radius}",
          placeholder: "BSC{...}",
          hint:
            "Once you've used the leaked credentials to access the protected endpoint, the simulated response shows the flag explicitly.",
          xp: 75,
        },
      ],
    },

    {
      number: 7,
      title: "Debrief",
      kind: "debrief",
      minutes: 3,
      body: [
        {
          kind: "p",
          value:
            "SSRF in cloud is the canonical example of 'small bug, big blast radius'. The bug itself - a server that fetches what you tell it to - is decades old and well-understood. The cloud metadata service is what made it catastrophic, and most organisations have not adjusted their threat model to match.",
        },
        { kind: "h3", value: "What you should take away" },
        {
          kind: "ul",
          items: [
            "Outbound traffic from any service is part of the security boundary. Block link-local and RFC1918 destinations from any fetcher that doesn't explicitly need them.",
            "Use IMDSv2 with hop-limit 1. It defeats most SSRF chains and doesn't require code changes.",
            "IAM least-privilege is not optional. Every role should have only what it needs, audited quarterly.",
            "Naive URL filters are a speed bump, not a defense. The attacker has every IP encoding and DNS trick on their side.",
            "When you build any 'fetch a URL' feature, design as if the URL is hostile - because eventually it will be.",
          ],
        },
        { kind: "h3", value: "Further reading" },
        {
          kind: "ul",
          items: [
            "OWASP SSRF Prevention Cheat Sheet",
            "Capital One 2019 incident report (filed by the New York Attorney General's office)",
            "AWS IMDSv2 documentation and migration guide",
            "HackerOne SSRF disclosure archive - pattern-match across hundreds of real reports",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "Once you've caught one SSRF, you'll see them everywhere - every webhook, every preview generator, every URL field is suspect. That instinct is worth having.",
        },
      ],
      questions: [
        {
          prompt: "I have completed the room and reviewed the debrief.",
          answer: "",
          placeholder: "No answer needed - close the loop",
          xp: 5,
        },
      ],
    },
  ],
};
