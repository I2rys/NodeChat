//Dependencies
const CPS = require("check-password-strength")
const Express_Param = require("express-param")
const LocalTunnel = require("localtunnel")
const Express = require("express")
const Chalk = require("chalk")

//Variables
const Self_Args = process.argv.slice(2)

const Web = Express()
const Port = process.env.PORT || Math.floor(Math.random() * 9999)

var NodeChat_Server_Data = {}
NodeChat_Server_Data.usernames = []
NodeChat_Server_Data.messages = ""

///Configurations
//Express
Web.use(Express_Param())

//Functions
async function LocalTunnel_Establisher(){
    const tunnel = await LocalTunnel(Port)

    console.log(`${Chalk.grey("[") + Chalk.blueBright("INFO") + Chalk.grey("]")} Server link ${tunnel.url}(Use this to invite your friends).`)
}

//Main
if(Self_Args.length == 0){
    console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Invalid password.`)
    process.exit()
}

if(CPS.passwordStrength(Self_Args[0]).value.indexOf("weak") != -1){
    console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Password is weak, please try again with a stronger one.`)
    process.exit()
}

Main()
function Main(){
    Web.use("", function(req, res){
        if(req.path == "/chat"){
            var username = req.fetchParameter(["username"]).username
            username = decodeURI(username)
            var message = req.fetchParameter(["message"]).message
            message = decodeURI(message)
            const password = req.fetchParameter(["password"]).password

            if(username.indexOf("[") != -1 || username.indexOf("%") != -1 || username.indexOf("[") != -1 || username.indexOf("{") != -1){
                console.log(`${Chalk.grey("[") + Chalk.yellowBright("WARNING") + Chalk.grey("]")} Someone is trying to do a XSS or something like that.`)
                return
            }

            if(password != Self_Args[0]){
                console.log(`${Chalk.grey("[") + Chalk.yellowBright("WARNING") + Chalk.grey("]")} Someone tried to join the chat but failed due to wrong password.`)
                return
            }

            if(NodeChat_Server_Data.usernames.indexOf(username) == -1){
                console.log(`${Chalk.grey("[") + Chalk.yellowBright("WARNING") + Chalk.grey("]")} Someone connected to the chat with the username of ${username}.`)
                NodeChat_Server_Data.usernames.push(username)
            }

            if(NodeChat_Server_Data.messages.length == 0){
                NodeChat_Server_Data.messages = `[${username}]: ${message}`
            }else{
                NodeChat_Server_Data.messages += `\n[${username}]: ${message}`
            }

            res.send("Done.")
        }else if(req.path == "/58721516/messages"){
            res.send(NodeChat_Server_Data.messages)
        }
    })
    
    //Listener
    Web.listen(Port, ()=>{
        console.log(`${Chalk.grey("[") + Chalk.blueBright("INFO") + Chalk.grey("]")} Server is running in port ${Port} with the password ${Self_Args[0]}.`)
        LocalTunnel_Establisher()
    })
}
