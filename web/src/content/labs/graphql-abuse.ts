import type { LabProfile } from "./types";

export const GRAPHQL_ABUSE: LabProfile = {
  key: "graphql-abuse",
  target: "api.acme.local/graphql",
  flag: "BSC{schema_is_an_oracle}",
  practicalKind: "graphql",
  category: "API / Authorization",
  mitre: "MITRE T1190 · T1212",
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
            "GraphQL is a query language and runtime for APIs that lets clients ask for exactly the data they need - no more, no less. Born inside Facebook in 2012 and open-sourced in 2015, it has displaced REST in many large platforms because it eliminates over-fetching and the N+1 problems that have haunted REST APIs for a decade.",
        },
        {
          kind: "p",
          value:
            "But GraphQL's flexibility is also its attack surface. A single endpoint accepts any query the schema allows, and the schema, by default, is fully discoverable. An attacker can ask the server 'what can I do here?' and the server will tell them, in remarkable detail. That answer alone is enough to find vulnerabilities that would have taken weeks of REST endpoint enumeration.",
        },
        { kind: "h3", value: "Learning objectives" },
        {
          kind: "ul",
          items: [
            "Understand the GraphQL execution model and why it differs structurally from REST",
            "Read a GraphQL schema and identify sensitive operations at a glance",
            "Recognise introspection as both a developer feature and a recon goldmine",
            "Identify field-level authorization mistakes that cause broken object-level access (BOLA)",
            "Recognise nesting, batching, and alias-based denial-of-service patterns",
            "Forge an unauthorised mutation in the practical and capture the flag",
          ],
        },
        { kind: "h3", value: "Prerequisites" },
        {
          kind: "p",
          value:
            "Comfort with JSON and HTTP is enough. No prior GraphQL experience is assumed; everything from query syntax to introspection is explained as we go.",
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "Estimated time: 60 minutes. Chapters 3 and 4 are the technical core - the practical hinges on getting both internalised.",
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
      title: "Anatomy of a GraphQL Request",
      kind: "mechanics",
      minutes: 6,
      body: [
        {
          kind: "p",
          value:
            "A GraphQL request, despite the buzz around it, is unremarkable on the wire: it's a POST to a single endpoint - usually /graphql - with a JSON body containing a query string. Unlike REST where every resource lives at its own URL, GraphQL exposes a single typed graph and the client navigates it through the query.",
        },
        {
          kind: "code",
          value:
            'POST /graphql HTTP/1.1\nContent-Type: application/json\n\n{\n  "query": "{ user(id: 42) { name email role } }",\n  "variables": {}\n}',
        },
        { kind: "h3", value: "Three operation types" },
        {
          kind: "ul",
          items: [
            "Query - read data (idempotent, cacheable)",
            "Mutation - modify data (not idempotent, side-effects expected)",
            "Subscription - realtime updates over WebSocket",
          ],
        },
        { kind: "h3", value: "The schema" },
        {
          kind: "p",
          value:
            "Every GraphQL API has a typed schema that declares every available type, field, query, and mutation. Schemas are written in Schema Definition Language (SDL). It is, in effect, the API's contract:",
        },
        {
          kind: "code",
          value:
            "type User {\n  id: ID!\n  name: String!\n  email: String!\n  role: Role!\n}\n\ntype Query {\n  user(id: ID!): User\n  me: User\n}\n\ntype Mutation {\n  updateUserRole(id: ID!, role: Role!): User\n}",
        },
        {
          kind: "p",
          value:
            "The exclamation mark means non-null. An attacker's first move on any GraphQL target is to acquire a copy of the schema - because the schema tells them where to look.",
        },
        { kind: "h3", value: "Field-level resolution" },
        {
          kind: "p",
          value:
            "Every field is resolved by a separate function called a resolver. When a request asks for user.email, the email resolver runs. This per-field execution is what makes GraphQL flexible - and it's also where most authorization mistakes happen, as we'll see in Chapter 4.",
        },
        {
          kind: "callout",
          tone: "redflag",
          value:
            "One endpoint, one HTTP method, one status code (almost always 200, even on errors). Traditional WAF and access-log rules built for REST are blind to most GraphQL attacks.",
        },
      ],
      questions: [
        {
          prompt: "What HTTP method does a GraphQL query usually use?",
          answer: "post",
          placeholder: "HTTP verb",
          xp: 10,
        },
        {
          prompt: "Which GraphQL operation type modifies data?",
          answer: "mutation",
          placeholder: "operation type",
          hint: "Three types - only one writes.",
          xp: 15,
        },
        {
          prompt:
            "In GraphQL, resolvers run per ___. (one word - what unit of the query?)",
          answer: "field",
          placeholder: "noun",
          xp: 15,
        },
      ],
    },

    {
      number: 3,
      title: "Introspection - The Schema as Oracle",
      kind: "mechanics",
      minutes: 7,
      body: [
        {
          kind: "p",
          value:
            "GraphQL specifies a meta-query system called introspection. By querying special fields prefixed with double underscores, a client can ask the server to describe its own schema. The feature exists for tooling - IDE autocomplete, codegen, GraphiQL, GraphQL Voyager - and it is on by default in essentially every popular library.",
        },
        {
          kind: "p",
          value:
            "Production teams are supposed to disable introspection before shipping. A remarkable number of them do not. Salt Labs' 2022 audit of public GraphQL endpoints found that roughly 60% had introspection enabled in production.",
        },
        { kind: "h3", value: "The full introspection query" },
        {
          kind: "code",
          value:
            "{\n  __schema {\n    types {\n      name\n      kind\n      fields {\n        name\n        type { name kind }\n      }\n    }\n  }\n}",
        },
        {
          kind: "p",
          value:
            "The response is a complete map of every type, every field, every argument, every mutation. It hands the attacker:",
        },
        {
          kind: "ul",
          items: [
            "All available types - including ones not exposed in any documented client",
            "Every field on every type, with their declared types",
            "Hidden mutations such as debug__deleteUser, internal__resetPassword, setRole",
            "Argument shapes for every operation, so payloads can be constructed precisely",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "Tools like GraphQL Voyager and InQL convert an introspection result into an interactive map of the entire API in seconds. Reconnaissance that would take weeks against a REST API takes minutes here.",
        },
        { kind: "h3", value: "Why developers leave it on" },
        {
          kind: "ul",
          items: [
            "Default-enabled in Apollo Server, GraphQL Yoga, Hasura, and most other servers",
            "'Disabled in production' config exists but is silently missed in copy-paste setups",
            "Fear of breaking tooling - devs leave it on for staging and forget to disable on promote",
            "The team running the API and the team writing internal clients are sometimes different teams",
          ],
        },
        { kind: "h3", value: "Beyond introspection: field suggestion" },
        {
          kind: "p",
          value:
            "Even with introspection disabled, attackers can lean on field suggestion. When a client queries an invalid field, most servers respond with helpful errors like 'Did you mean userProfile?'. Tools such as Clairvoyance brute-force schemas one suggestion at a time, reconstructing the full type system in a few thousand requests.",
        },
      ],
      questions: [
        {
          prompt: "What two characters prefix introspection-only fields?",
          answer: "__",
          placeholder: "characters",
          hint: "Type it literally. Two characters.",
          xp: 15,
        },
        {
          prompt: "What top-level introspection field returns the entire schema?",
          answer: "__schema",
          placeholder: "field name",
          xp: 15,
        },
        {
          prompt:
            'What technique extracts field names by triggering "Did you mean" errors? (two words)',
          answer: "field suggestion",
          placeholder: "technique name",
          hint: 'It\'s named after the error message itself.',
          xp: 20,
        },
      ],
    },

    {
      number: 4,
      title: "Authorization at the Wrong Layer",
      kind: "threat",
      minutes: 8,
      body: [
        {
          kind: "p",
          value:
            "This is where GraphQL APIs bleed. In REST, you write authorization at the endpoint: /admin/users/42 checks 'is the caller an admin?'. There's exactly one place to check, and frameworks make it natural to put the check there. GraphQL has only one endpoint, so authorization has to be written at the resolver level - every field, every type, every mutation has to be individually guarded. Most teams don't.",
        },
        {
          kind: "p",
          value:
            "The pattern looks like this in code review, and it should make you nervous:",
        },
        {
          kind: "code",
          value:
            "const resolvers = {\n  Query: {\n    user: (_, { id }) => db.users.find(id),\n  },\n  Mutation: {\n    updateUserRole: (_, { id, role }) => db.users.update(id, { role }),\n  },\n}",
        },
        {
          kind: "p",
          value:
            "Every entry has to silently answer the question 'who can call this?'. When the team is shipping fast, the answer is often 'we'll add it later'. It rarely gets back on the list.",
        },
        { kind: "h3", value: "Three classes of broken authz" },
        {
          kind: "ul",
          items: [
            "Object-level (BOLA): user(id: 42) returns user 42 even when the caller is user 7. The resolver doesn't check ownership.",
            "Field-level: user(id: 7).ssn returns the caller's own SSN - fine - but user(id: 7).adminNotes shouldn't, and if adminNotes has no separate check, anyone can read it.",
            "Mutation-level: updateUserRole supposedly requires admin. Did anyone wire that check up? In a fresh codebase under deadline, the answer is rarely yes.",
          ],
        },
        { kind: "h3", value: "A historical example" },
        {
          kind: "p",
          value:
            "Shopify's 2018 disclosure described a single vulnerable mutation that let any authenticated user become a store admin. The mutation was guarded against unauthenticated access - but not against unauthorized authenticated access. Fixed in days; would have taken months in a REST codebase to even map.",
        },
        {
          kind: "callout",
          tone: "redflag",
          value:
            "GraphQL libraries do not enforce authorization. They give you tools - directives, schema visitors, middleware. What you do with those tools is entirely your problem.",
        },
        { kind: "h3", value: "Hunting these in the wild" },
        {
          kind: "ul",
          items: [
            "Run introspection. Enumerate every mutation.",
            "For each mutation, ask: 'Could a regular user call this and have it work?'",
            "For each query, ask: 'If I substitute someone else's ID, does the response change?'",
            "Look for naming red flags: 'admin', 'internal', 'debug', 'set', 'override' - these tend to be sensitive even if undocumented.",
          ],
        },
      ],
      questions: [
        {
          prompt: "What does BOLA stand for? (initialism - full phrase)",
          answer: "broken object level authorization",
          placeholder: "full phrase",
          hint: "Four words. Starts with 'broken'.",
          xp: 25,
        },
        {
          prompt:
            "GraphQL frameworks enforce authorization automatically. (true/false)",
          answer: "false",
          placeholder: "true or false",
          xp: 15,
        },
        {
          prompt:
            "Where in the GraphQL execution model must authorization checks be written?",
          answer: "resolver",
          placeholder: "one word",
          xp: 20,
        },
      ],
    },

    {
      number: 5,
      title: "Aliases, Batching & Query DoS",
      kind: "threat",
      minutes: 7,
      body: [
        {
          kind: "p",
          value:
            "GraphQL gives the client an unusual amount of control over how much work the server does per request. That's a feature for legitimate clients writing efficient queries - and a weapon for attackers who can multiply the cost of a single HTTP request by orders of magnitude.",
        },
        { kind: "h3", value: "Aliases" },
        {
          kind: "p",
          value:
            "A single query can ask for the same field many times, each under a different alias. The query parser sees one request; the resolver runs hundreds or thousands of times:",
        },
        {
          kind: "code",
          value:
            "{\n  a1: user(id: 1)    { email }\n  a2: user(id: 2)    { email }\n  a3: user(id: 3)    { email }\n  ...\n  a1000: user(id: 1000) { email }\n}",
        },
        {
          kind: "p",
          value:
            "Server runs 1,000 lookups in one HTTP request. Rate limits keyed on HTTP request count don't help. This is the simplest path to mass scraping and the simplest path to brute-forcing user IDs.",
        },
        { kind: "h3", value: "Nested depth" },
        {
          kind: "p",
          value:
            "GraphQL types reference each other freely. If Post has a comments field returning [Comment], and Comment has an author field returning User, and User has posts returning [Post], you can write a query 50 levels deep:",
        },
        {
          kind: "code",
          value:
            "{ user(id: 1) { posts { comments { author { posts { comments { ... } } } } } } }",
        },
        {
          kind: "p",
          value:
            "Each level multiplies the work. Without depth limits, the server runs out of memory or CPU long before returning a response. The resulting outage is hard to attribute, because the request that triggered it is just one POST in the access log.",
        },
        { kind: "h3", value: "Query batching" },
        {
          kind: "p",
          value:
            "Many GraphQL clients support sending an array of queries in one request. Servers that accept it will run them all sequentially or in parallel. Same scraping risk as aliases, sometimes harder to spot in logs because each batched op may not be logged separately.",
        },
        { kind: "h3", value: "Cost analysis as the defense" },
        {
          kind: "p",
          value:
            "The right defense is to assign every field a 'cost' and reject queries whose total cost exceeds a per-request budget. Apollo, Hasura, and graphql-armor ship libraries for this - but it's opt-in, and adding it after a public launch is much harder than including it from the start.",
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "If a target's GraphQL endpoint accepts a 50-deep introspection query without complaint, it almost certainly has no depth or cost limits. Note that down - it almost guarantees the API has no resource ceiling at all.",
        },
      ],
      questions: [
        {
          prompt:
            "What GraphQL feature lets a client request the same field many times in one query?",
          answer: "aliases",
          placeholder: "feature name",
          hint: "Plural. Each occurrence has a different label.",
          xp: 20,
        },
        {
          prompt:
            "What query characteristic, beyond raw size, is bounded by 'depth limits'?",
          answer: "nesting",
          placeholder: "one word",
          xp: 15,
        },
        {
          prompt:
            "What defense assigns a numeric weight to fields and rejects queries above a per-request budget? (two words)",
          answer: "cost analysis",
          placeholder: "two words",
          xp: 25,
        },
      ],
    },

    {
      number: 6,
      title: "Practical: Forge an Unauthorised Mutation",
      kind: "exploit",
      minutes: 25,
      body: [
        {
          kind: "p",
          value:
            "Time to put this together. The target is a GraphQL endpoint that has all three of the bugs we covered: introspection is on, an internal-looking mutation is reachable, and authorization on that mutation is broken. Boot the lab below to engage the simulated server.",
        },
        { kind: "h3", value: "Your task" },
        {
          kind: "ul",
          items: [
            "Run an introspection query to discover the schema",
            "Read the mutation list carefully - find the one that doesn't belong in a public API",
            "Call that mutation with a payload that escalates your role to admin",
            "Capture the flag the server returns on success",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "There is no time limit. The hidden mutation has a name that suggests it's internal-only - names matter, even when they shouldn't. The flag is in the BSC{...} format.",
        },
      ],
      questions: [
        {
          prompt: "Submit the captured flag to complete the room.",
          answer: "BSC{schema_is_an_oracle}",
          placeholder: "BSC{...}",
          hint:
            "Once you call the right mutation with role: admin, the simulated response shows the flag explicitly.",
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
            "GraphQL didn't invent any new vulnerability classes. What it did was concentrate familiar problems - broken authorization, information disclosure, denial of service - onto a single endpoint where they're harder to catch with traditional tooling. The bugs are old; the surface is new.",
        },
        { kind: "h3", value: "What you should take away" },
        {
          kind: "ul",
          items: [
            "Disable introspection in production. Always. There is no scenario where leaving it on outweighs the recon it gives an attacker.",
            "Authorization runs at the resolver level. Every resolver. No exceptions. Use directives or middleware so the rule is enforced uniformly.",
            "Set query depth limits, alias limits, and cost analysis from day one. Adding them retroactively after an incident is meaningfully more expensive than putting them in upfront.",
            "Treat your schema as part of your attack surface. A field name is not a secret, but the existence of a setRole mutation behind introspection is.",
            "WAFs designed for REST will not catch most of this. Either configure them to inspect query bodies, or accept the gap and put your defenses into application code.",
          ],
        },
        { kind: "h3", value: "Further reading" },
        {
          kind: "ul",
          items: [
            "OWASP GraphQL Cheat Sheet",
            "Apollo Server security best practices documentation",
            "Salt Labs annual GraphQL audit reports",
            "PortSwigger Web Security Academy: GraphQL attacks track",
          ],
        },
        {
          kind: "callout",
          tone: "tip",
          value:
            "If you finished the practical without reading any hints, you're ahead of the median engineer shipping production GraphQL today. Most teams don't run introspection against their own APIs in dev - be the one who does.",
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
