import { Header } from "@/shared/components";

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return <>
        <Header />

        <div>{children}</div>
    </>
}