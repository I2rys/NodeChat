//Dependencies
const ReadLine = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})
const Request = require("request")

//Variables
const Self_Args = process.argv.slice(2)

var NodeChat_Client_Data = {}
NodeChat_Client_Data.messages = ""

//Main
Chat()
async function Chat(){
    MR()

    ReadLine.question("> ", message =>{
        if(message == ""){
            Chat()
            return
        }

        Request(`${Self_Args[2]}/chat?username=${Self_Args[0]}&message=${message}&password=${Self_Args[1]}`, {
            headers: {
                "Bypass-Tunnel-Reminder": true
            }
        },function(err, res, body){
            if(err){
                console.log("Something went wrong while requesting to the server.")
                Chat()
                return
            }
            
            if(body == "Done!"){
                Main()
                return
            }else{
                console.log("Something went wrong while requesting to the server.")
                Chat()
                return
            }
        })
    })
}

//Messages reciever
function MR(){
    setInterval(function(){
        Request(`${Self_Args[2]}/58721516/messages`, {
            headers: {
                "Bypass-Tunnel-Reminder": true
            }
        },function(err, res, body){
            if(err){
                console.log("Looks like the server is died.")
                process.exit()
            }

            if(body == ""){
                return
            }

            if(NodeChat_Client_Data.messages.length == 0){
                NodeChat_Client_Data.messages = body
            }else{
                if(NodeChat_Client_Data.messages != body){
                    var new_message = body.slice(body.indexOf(NodeChat_Client_Data.messages), body.length)

                    console.log(new_message)

                    NodeChat_Client_Data.messages = body
                }
            }
        })
    }, 1000)
}
