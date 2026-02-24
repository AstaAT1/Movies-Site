// Container.jsx — Layout primitive: max-width + horizontal padding
// Use this everywhere instead of repeating max-w-[1400px] mx-auto px-4...
export default function Container({ children, className = "" }) {
    return (
        <div className={`mx-auto w-full max-w-[1400px] px-4 md:px-6 ${className}`}>
            {children}
        </div>
    );
}
