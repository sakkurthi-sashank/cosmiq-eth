// HelloWorld.cdc - A simple Hello World smart contract for Flow blockchain
// This contract demonstrates basic Cadence functionality with deployable contract

access(all) contract HelloWorld {

    // Public variable to store the greeting message
    access(all) var greeting: String

    // Event that gets emitted when the contract is deployed
    access(all) event ContractDeployed(message: String)

    // Event that gets emitted when greeting is updated
    access(all) event GreetingUpdated(newGreeting: String)

    // Event that gets emitted when hello function is called
    access(all) event HelloCalled(message: String)

    // Initialize the contract with a default greeting
    init() {
        self.greeting = "Hello, World from Flow Blockchain!"

        // Emit deployment event
        emit ContractDeployed(message: "HelloWorld contract successfully deployed!")

        // Log to console (this will appear in transaction logs)
        log("🎉 HelloWorld contract deployed successfully!")
        log("📝 Initial greeting: ".concat(self.greeting))
    }

    // Public function to get the current greeting
    access(all) view fun getGreeting(): String {
        return self.greeting
    }

    // Public function to say hello and log the message
    access(all) fun sayHello(): String {
        let message = "Hello from Flow! Current greeting: ".concat(self.greeting)

        // Emit event
        emit HelloCalled(message: message)

        // Log to console
        log("👋 Hello function called!")
        log("💬 Message: ".concat(message))

        return message
    }

    // Function to update the greeting message
    access(all) fun updateGreeting(newGreeting: String) {
        let oldGreeting = self.greeting
        self.greeting = newGreeting

        // Emit event
        emit GreetingUpdated(newGreeting: newGreeting)

        // Log to console
        log("🔄 Greeting updated!")
        log("📝 Old greeting: ".concat(oldGreeting))
        log("📝 New greeting: ".concat(newGreeting))
    }

    // Function to get contract info
    access(all) view fun getContractInfo(): {String: String} {
        return {
            "name": "HelloWorld",
            "description": "A simple Hello World smart contract for Flow blockchain",
            "version": "1.0.0",
            "greeting": self.greeting
        }
    }
}
