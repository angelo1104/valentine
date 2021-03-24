import NodeModel from "../mongodb/NodeModel";

const listen = (): void => {
    try {
        const changeStream = NodeModel.watch()

        changeStream.on("change", change=> {
            console.log("changed...")

            switch (change.operationType) {
                case "insert":
                {
                    const { fullDocument } = change

                    console.log("inserted")
                    break
                }
                case "delete":
                {
                    console.log("delete")
                    break
                }
                case "update":
                {
                    console.log("update")
                    break
                }
                default:
                    console.log("None")
            }
        })
    }catch (e) {
        console.log("error in mongoose streams", e)
    }
}

export default listen