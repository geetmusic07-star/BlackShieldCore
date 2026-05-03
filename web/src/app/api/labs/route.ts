import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseLabRow } from "@/app/labs/page";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ THIS WAS MISSING
export async function GET() {
    try {
        const { data, error } = await supabase
            .from("labs")
            .select("*")
            .returns<SupabaseLabRow[]>();

        if (error) {
            console.error("🔥 Supabase error FULL:", JSON.stringify(error, null, 2));
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("API error:", err);
        return NextResponse.json([], { status: 500 });
    }
}