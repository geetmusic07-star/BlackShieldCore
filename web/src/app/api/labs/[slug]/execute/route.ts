import { NextRequest, NextResponse } from "next/server";

// =====================================
// 🎯 LEVEL CONFIGURATION
// =====================================
const LEVELS: Record<number, { name: string; required: string[] }> = {
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

// =====================================
// 🔥 MULTI-ATTACK ANALYZER
// =====================================
function analyzeToken(token: string) {
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

        // =========================
        // 🔥 ATTACK 1: alg:none
        // =========================
        if (header.alg === "none") {
            techniques.push("alg-none");
            score += 100;
            explanations.push(
                "Server accepts unsigned tokens (alg:none), allowing full forgery."
            );
        }

        // =========================
        // 🔥 ATTACK 2: weak signature
        // =========================
        if (signature && header.alg === "HS256") {
            techniques.push("weak-signature");
            score += 70;
            explanations.push(
                "Signature is not properly verified, allowing tampering."
            );
        }

        // =========================
        // 🔥 ATTACK 3: alg confusion
        // =========================
        if (header.alg === "HS256" && header.key === "public") {
            techniques.push("alg-confusion");
            score += 150;
            explanations.push(
                "Public key used as HMAC secret → algorithm confusion."
            );
        }

        // =========================
        // 🔥 ATTACK 4: kid injection
        // =========================
        if (header.kid && header.kid.includes("..")) {
            techniques.push("kid-injection");
            score += 120;
            explanations.push(
                "KID parameter allows path traversal / key injection."
            );
        }

        // =========================
        // 🔥 ATTACK 5: role escalation
        // =========================
        if (payload.role === "admin") {
            techniques.push("role-escalation");
            score += 90;
            explanations.push(
                "Server trusts user-controlled role field."
            );
        }

        // =========================
        // 🚀 COMBO BONUS
        // =========================
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

// =====================================
// ✅ OPTIONAL (prevents 405 on GET)
// =====================================
export async function GET() {
    return NextResponse.json({
        message: "Use POST to interact with this endpoint",
    });
}

// =====================================
// 🚀 MAIN API (LEVEL-AWARE)
// =====================================
export async function POST(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const body = await req.json();
        const token = body.payload;
        const level = body.level || 1;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "No token provided" },
                { status: 400 }
            );
        }

        const result = analyzeToken(token);
        const currentLevel = LEVELS[level];

        if (!currentLevel) {
            return NextResponse.json({
                success: false,
                message: "Invalid level",
            });
        }

        const completed = currentLevel.required.every((tech) =>
            result.techniques?.includes(tech)
        );

        return NextResponse.json({
            labId: params.slug,
            ...result,
            level,
            levelName: currentLevel.name,
            levelComplete: completed,
            nextLevel: completed ? level + 1 : level,
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}