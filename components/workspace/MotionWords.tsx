import { Children, cloneElement, isValidElement, type ReactNode } from "react";

// Real text rendered by React, with whitespace, emphasis and semantics intact.
function words(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child).split(/(\s+)/).map((word, index) => /^\s*$/.test(word) ? word :
        <span className="motion-word-mask" key={index}><span className="motion-word">{word}</span></span>);
    }
    if (isValidElement<{children?: ReactNode}>(child) && typeof child.type === "string" && child.props.children) {
      return cloneElement(child, {}, words(child.props.children));
    }
    return child;
  });
}
export function MotionWords({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <span className="motion-copy" data-motion-words data-motion-delay={delay}>{words(children)}</span>;
}
