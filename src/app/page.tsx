import Homepage from "@/screen/Homepage";
import Naviagtion from "@/components/Navigation"


function Page() {
    return (
        <div className="fit-container flex flex-col justify-center my-3 gap-3">
            <Naviagtion />
            <Homepage />
        </div>
    )
}

export default Page