"use client";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBeamProps {
    className?: string;
    containerRef: React.RefObject<HTMLElement>;
    fromRef: React.RefObject<HTMLElement>;
    toRef: React.RefObject<HTMLElement>;
    curvature?: number;
    reverse?: boolean;
    duration?: number;
    delay?: number;
    pathColor?: string;
    pathWidth?: number;
    pathOpacity?: number;
    gradientStartColor?: string;
    gradientStopColor?: string;
    startXOffset?: number;
    startYOffset?: number;
    endXOffset?: number;
    endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
    className,
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false,
    duration = Math.random() * 3 + 4,
    delay = 0,
    pathColor = "gray",
    pathWidth = 2,
    pathOpacity = 0.2,
    gradientStartColor = "#18CCFC",
    gradientStopColor = "#6344F5",
    startXOffset = 0,
    startYOffset = 0,
    endXOffset = 0,
    endYOffset = 0,
}) => {
    const id = React.useId();
    const controls = useAnimation();
    const isInView = useInView(containerRef);

    useEffect(() => {
        if (isInView) {
            controls.start({
                strokeDashoffset: [1, 0],
                transition: { duration, delay, ease: "easeInOut" },
            });
        }
    }, [isInView, controls, duration, delay]);

    const calculatePath = (): string => {
        if (!fromRef.current || !toRef.current || !containerRef.current) {
            return "";
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const fromRect = fromRef.current.getBoundingClientRect();
        const toRect = toRef.current.getBoundingClientRect();

        const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
        const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
        const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
        const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

        const controlPointX = (startX + endX) / 2;
        const controlPointY = (startY + endY) / 2 - curvature;

        return `M ${startX},${startY} Q ${controlPointX},${controlPointY} ${endX},${endY}`;
    };

    const svgDimensions = () => {
        if (!containerRef.current) return { width: 0, height: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    };

    const { width, height } = svgDimensions();

    return (
        <svg
            fill="none"
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            className={cn("pointer-events-none absolute left-0 top-0 transform-gpu", className)}
            viewBox={`0 0 ${width} ${height}`}
        >
            <defs>
                <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
                    <stop offset="50%" stopColor={gradientStartColor} />
                    <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d={calculatePath()}
                stroke={pathColor}
                strokeWidth={pathWidth}
                strokeOpacity={pathOpacity}
                fill="none"
            />
            <motion.path
                d={calculatePath()}
                stroke={`url(#gradient-${id})`}
                strokeWidth={pathWidth}
                strokeDasharray="5 5"
                strokeDashoffset={1}
                fill="none"
                animate={controls}
                initial={{ strokeDashoffset: 1 }}
            />
        </svg>
    );
};
