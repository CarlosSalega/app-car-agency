"use client";

import { useEffect } from "react";

export default function ScrollLockFix() {
  useEffect(() => {
    const styleId = "scroll-lock-override-style";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.setAttribute("data-generated-by", "scroll-lock-fix");
      document.head.appendChild(styleElement);
    }

    const css = `
      body[data-scroll-locked],
      body[data-scroll-locked="true"],
      body[data-scroll-locked="1"],
      html[data-scroll-locked],
      html[data-scroll-locked="true"],
      html[data-scroll-locked="1"] {
	      --removed-body-scroll-bar-size: 0px !important;
	      padding-right: 0px !important;
	      margin-right: 0px !important;
	      width: auto !important;
      }
    `;

    styleElement.textContent = css;

    const applyFix = () => {
      try {
        document.body.style.removeProperty("padding-right");
        document.body.style.removeProperty("margin-right");
        document.body.style.removeProperty("width");
        document.documentElement.style.removeProperty("padding-right");
        document.documentElement.style.removeProperty("margin-right");
        document.documentElement.style.removeProperty("width");
        document.documentElement.style.setProperty("--removed-body-scroll-bar-size", "0px", "important");
        document.body.style.setProperty("--removed-body-scroll-bar-size", "0px", "important");
        if (styleElement && styleElement.parentElement !== document.head) {
          document.head.appendChild(styleElement);
        } else if (styleElement) {
          document.head.appendChild(styleElement);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
          const element = mutation.target as HTMLElement;
          if (element.hasAttribute("data-scroll-locked")) {
            applyFix();
            let attempts = 0;
            const interval = setInterval(() => {
              if (!document.body.hasAttribute("data-scroll-locked") || attempts > 10) {
                clearInterval(interval);
                return;
              }
              applyFix();
              attempts += 1;
            }, 50);
          }
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    if (
      document.body.hasAttribute("data-scroll-locked") ||
      document.documentElement.hasAttribute("data-scroll-locked")
    ) {
      applyFix();
    }
    return () => {
      observer.disconnect();
      try {
        styleElement?.parentElement?.removeChild(styleElement);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);
  return null;
}
