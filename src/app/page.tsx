import Homepage from "@/screen/Homepage";
import Naviagtion from "@/components/Navigation"


function Page() {
    return (
        <div className="mx-4 flex flex-col justify-center my-3 gap-3">
            <Naviagtion />
            <Homepage />
        </div>
    )
}

export default Page