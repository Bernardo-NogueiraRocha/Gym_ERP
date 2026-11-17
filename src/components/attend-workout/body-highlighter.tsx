"use client";

import Body, { type ExtendedBodyPart } from "@mjcdev/react-body-highlighter";

interface BodyHighlighterProps {
    data: ExtendedBodyPart[];
}

export default function BodyHighlighter({ data }: BodyHighlighterProps) {
    return (
        <div className="grid grid-cols-2 gap-2" aria-label="Front and back muscle activation diagrams">
            <Body
                data={data}
                gender="male"
                side="front"
                scale={1.7}
                border="var(--border)"
                colors={["var(--info)", "var(--primary)", "var(--accent)"]}
            />
            <Body
                data={data}
                gender="male"
                side="back"
                scale={1.7}
                border="var(--border)"
                colors={["var(--info)", "var(--primary)", "var(--accent)"]}
            />
        </div>
    );
}
