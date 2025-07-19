import CreateContent from "@/screen/CreateContent";
import Navigation from "@/components/Navigation"


function Page() {
    return (
        <div className="flex flex-col justify-center my-3 gap-3 mx-4">
            <Navigation />
            <CreateContent />
        </div>
    )
}

export default Page