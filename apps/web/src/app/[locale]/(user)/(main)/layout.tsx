import { Header } from "@/shared/components";

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex-1 flex flex-col">
            <Header />

            <div className="flex-1 flex flex-col">{children}</div>
        </div>
    )
}