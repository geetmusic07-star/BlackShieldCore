import { NextRequest, NextResponse } from "next/server";

// =====================================
// 🎯 JWT LAB CONFIGURATION & LOGIC
// =====================================
const JWT_LEVELS: Record<number, { name: string; required: string[] }> = {
    1: { name: "alg-none", required: ["alg-none"] },
    2: { name: "weak-signature", required: ["weak-signature"] },
    3: { name: "role-escalation", required: ["role-escalation"] },
    4: { name: "alg-confusion", required: ["alg-confusion"] },
    5: { name: "kid-injection", required: ["kid-injection"] },
    6: {
        name: "multi-chain",
        required: ["alg-none", "kid-injection", "role-escalation"],
    },
};

function analyzeJwtToken(token: string) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            return { success: false, message: "Invalid JWT format" };
        }

        const header = JSON.parse(
            Buffer.from(parts[0], "base64url").toString()
        );
        const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString()
        );
        const signature = parts[2];

        const techniques: string[] = [];
        let score = 0;
        const explanations: string[] = [];

        if (header.alg === "none") {
            techniques.push("alg-none");
            score += 100;
            explanations.push(
                "Server accepts unsigned tokens (alg:none), allowing full forgery."
            );
        }

        if (signature && header.alg === "HS256") {
            techniques.push("weak-signature");
            score += 70;
            explanations.push(
                "Signature is not properly verified, allowing tampering."
            );
        }

        if (header.alg === "HS256" && header.key === "public") {
            techniques.push("alg-confusion");
            score += 150;
            explanations.push(
                "Public key used as HMAC secret → algorithm confusion."
            );
        }

        // Note: For a true cyber range, this should validate actual path traversal syntax.
        if (header.kid && header.kid.includes("..")) {
            techniques.push("kid-injection");
            score += 120;
            explanations.push(
                "KID parameter allows path traversal / key injection."
            );
        }

        if (payload.role === "admin") {
            techniques.push("role-escalation");
            score += 90;
            explanations.push(
                "Server trusts user-controlled role field."
            );
        }

        if (techniques.length >= 2) {
            score += 50;
            explanations.push(
                "Multiple vulnerabilities chained together (combo bonus)."
            );
        }

        if (techniques.length === 0) {
            return {
                success: false,
                techniques: [] as string[],
                score: 0,
                message: "No exploit detected",
            };
        }

        return {
            success: true,
            techniques,
            score,
            message: "Attack chain detected",
            explanation: explanations.join("\n"),
        };
    } catch {
        return { success: false, message: "Malformed token" };
    }
}

async function handleJwtExploit(body: any, slug: string) {
    const token = body.payload;
    const level = body.level || 1;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "No token provided" },
            { status: 400 }
        );
    }

    const result = analyzeJwtToken(token);
    const currentLevel = JWT_LEVELS[level];

    if (!currentLevel) {
        return NextResponse.json({
            success: false,
            message: "Invalid level",
        }, { status: 400 });
    }

    const completed = currentLevel.required.every((tech) =>
        (result as any).techniques?.includes(tech)
    );

    return NextResponse.json({
        labId: slug,
        ...result,
        level,
        levelName: currentLevel.name,
        levelComplete: completed,
        nextLevel: completed ? level + 1 : level,
        ...(completed && { flag: "BSC{jwt_signature_bypassed}" }),
    });
}

// =====================================
// 🎯 GRAPHQL ABUSE LAB LOGIC
// =====================================
async function handleGraphqlAbuse(body: any, slug: string) {
    const payload = body.payload;

    if (!payload) {
        return NextResponse.json(
            { success: false, message: "No payload provided" },
            { status: 400 }
        );
    }

    const queryStr = typeof payload === "string" ? payload : JSON.stringify(payload);

    // Note: If you want stricter validation, consider regex to ensure these keywords aren't just in a comment.
    const isMutation = queryStr.includes("mutation");
    const targetsRole = queryStr.toLowerCase().includes("role");
    const setsAdmin = queryStr.toLowerCase().includes("admin");

    if (isMutation && targetsRole && setsAdmin) {
        return NextResponse.json({
            labId: slug,
            success: true,
            score: 500,
            message: "Unauthorised mutation executed successfully",
            explanation: "You successfully bypassed the missing resolver-level authorization check.",
            flag: "BSC{schema_is_an_oracle}",
            levelComplete: true
        });
    }

    if (queryStr.includes("__schema") || queryStr.includes("__type")) {
        return NextResponse.json({
            labId: slug,
            success: false,
            message: "Introspection query executed",
            explanation: "You successfully ran an introspection query to discover the schema. Now find the hidden mutation and execute it.",
            levelComplete: false
        });
    }

    return NextResponse.json({
        labId: slug,
        success: false,
        message: "Exploit failed",
        explanation: "The query executed, but it did not mutate the target role. Check the schema again.",
        levelComplete: false
    });
}

// =====================================
// 🎯 SSRF METADATA LAB LOGIC
// =====================================
async function handleSsrfMetadata(body: any, slug: string) {
    const payload = body.payload;

    if (!payload) {
        return NextResponse.json(
            { success: false, message: "No target URL provided" },
            { status: 400 }
        );
    }

    const urlStr = String(payload).toLowerCase();

    if (urlStr.includes("169.254.169.254")) {
        if (urlStr.includes("latest/meta-data") || urlStr.includes("iam/security-credentials")) {
            return NextResponse.json({
                labId: slug,
                success: true,
                score: 500,
                message: "Cloud metadata service reached",
                explanation: "You successfully forced the server to request its own cloud instance metadata, bypassing basic validation.",
                flag: "BSC{imds_v1_is_a_mistake}",
                levelComplete: true
            });
        }

        return NextResponse.json({
            labId: slug,
            success: false,
            message: "Partial SSRF hit",
            explanation: "You hit the metadata IP, but you need to request a specific path to dump the credentials.",
            levelComplete: false
        });
    }

    return NextResponse.json({
        labId: slug,
        success: false,
        message: "SSRF failed",
        explanation: "The server fetched the URL, but it was not the internal metadata service.",
        levelComplete: false
    });
}

// =====================================
// ✅ OPTIONAL (prevents 405 on GET)
// =====================================
export async function GET() {
    return NextResponse.json({
        message: "Use POST to interact with this endpoint",
    });
}

// =====================================
// 🚀 MAIN API (DISPATCHER)
// =====================================
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> } | any
) {
    const params = await (context.params instanceof Promise ? context.params : Promise.resolve(context.params));
    const slug = params?.slug;

    try {
        // 1. Read the raw text first to enforce a size limit
        const rawBody = await req.text();

        // 2. Reject payloads larger than 10KB (10000 characters)
        // This prevents memory exhaustion in Vercel Serverless Functions
        if (rawBody.length > 10000) {
            return NextResponse.json(
                { success: false, message: "Payload too large. Maximum size is 10KB." },
                { status: 413 } // HTTP 413 Payload Too Large
            );
        }

        // 3. Safely parse the JSON now that we know the size is reasonable
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (parseError) {
            return NextResponse.json(
                { success: false, message: "Invalid JSON payload format." },
                { status: 400 }
            );
        }

        // 4. Dispatch to the correct lab logic
        switch (slug) {
            case "jwt-exploit":
                return await handleJwtExploit(body, slug);
            case "graphql-abuse":
                return await handleGraphqlAbuse(body, slug);
            case "ssrf-metadata":
                return await handleSsrfMetadata(body, slug);
            default:
                return NextResponse.json(
                    { success: false, message: `No execution engine found for lab: ${slug}` },
                    { status: 404 }
                );
        }
    } catch (e) {
        console.error(`Error processing lab execution for ${slug}:`, e);
        return NextResponse.json(
            { success: false, message: "Server error occurred during execution." },
            { status: 500 }
        );
    }
}