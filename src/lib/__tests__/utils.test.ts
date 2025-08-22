import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility function", () => {
    it("returns a single class", () => {
        expect(cn("foo")).toBe("foo");
    });

    it("merges multiple classes", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles falsy values", () => {
        expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
        expect(cn("base", true && "active")).toBe("base active");
        expect(cn("base", false && "active")).toBe("base");
    });

    it("handles objects with boolean values", () => {
        expect(cn({ foo: true, bar: false })).toBe("foo");
        expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });

    it("returns empty string for no input", () => {
        expect(cn()).toBe("");
    });

    it("handles arrays of classes", () => {
        expect(cn(["foo", "bar"])).toBe("foo bar");
        expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
    });

    it("merges conflicting Tailwind classes (via twMerge)", () => {
        // twMerge should handle conflicting classes by keeping the last one
        expect(cn("p-2", "p-4")).toBe("p-4");
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
        expect(cn("bg-red-200 bg-blue-300")).toBe("bg-blue-300");
    });

    it("handles complex combinations", () => {
        expect(cn(
            "base-class",
            { conditional: true, disabled: false },
            ["array", "classes"],
            "final-class"
        )).toBe("base-class conditional array classes final-class");
    });
});