import BodyHighlighter from "./body-highlighter";
import type { ExtendedBodyPart } from "@mjcdev/react-body-highlighter";

interface MuscleActivationPanelProps {
    muscles: ExtendedBodyPart[];
}

export function MuscleActivationPanel({ muscles }: MuscleActivationPanelProps) {
    return (
        <section className="space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
            <div>
                <h2 className="font-semibold">Muscle activation</h2>
                <p className="text-sm text-muted-foreground">
                    Highlights update as you complete sets.
                </p>
            </div>
            <BodyHighlighter data={muscles} />
            <div
                className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"
                aria-label="Muscle activation intensity legend"
            >
                <span className="flex items-center gap-2">
                    <i className="h-3 w-3 rounded-sm bg-info" />Light
                </span>
                <span className="flex items-center gap-2">
                    <i className="h-3 w-3 rounded-sm bg-primary" />Moderate
                </span>
                <span className="flex items-center gap-2">
                    <i className="h-3 w-3 rounded-sm bg-accent" />High
                </span>
            </div>
        </section>
    );
}
