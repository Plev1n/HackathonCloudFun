const functions = require('firebase-functions');
const admin = require("firebase-admin");

const { WebhookClient } = require("dialogflow-fulfillment");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://carassistant-hqgime.firebaseio.com"
})
const db = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    function handleHeating(agent) {
        let heatingOnOff = agent.parameters.boolean;
        if (heatingOnOff === "true") { heatingOnOff = true } else { heatingOnOff = false }
        return db.doc("data/heating").update({
            isHeatingOn: heatingOnOff
        }).then(() => {
            return agent.add("The heating was updated.")
        })
    }

    function handleAC(agent) {
        let ACOnOff = agent.parameters.boolean;
        if (ACOnOff === "true") { ACOnOff = true } else { ACOnOff = false }
        return db.doc("data/heating").update({
            isACTurnedOn: ACOnOff
        }).then(() => {
            return agent.add("The AC was updated.")
        })
    }
    function handleTheRadio(agent) {
        let radioStationOnOff = agent.parameters.boolean;
        if (radioStationOnOff === "true") { radioStationOnOff = true } else { radioStationOnOff = false }
        return db.doc("data/radio").update({
            isRadioTurnedOn: radioStationOnOff
        }).then(() => {
            return agent.add("The radio was updated.")
        })
    }
    function HeatingTempValue(agent) {
        const tempValue = agent.parameters.number;
        return db.doc("data/heating").update({
            TempValue: tempValue
        }).then(() => {
            return agent.add("The temperature was updated.")
        })
    }
    function SwitchTheRadio(agent) {
        const radioStation = agent.parameters.number;
        return db.doc("data/radio").update({
            station: radioStation
        }).then(() => {
            return agent.add("The radio station was switched to station " + radioStation)
        })
    }
    function NavigateToCity(agent) {
        const city = agent.parameters.geocity;
        return db.doc("data/navigation").update({
            destination: city
        }).then(() => {
            return agent.add("The destination was set to " + city)
        })
    }
    function NavigationOnOff(agent) {
        let navigationOnOff = agent.parameters.boolean;
        if (navigationOnOff === "true") { navigationOnOff = true } else { navigationOnOff = false }
        return db.doc("data/navigation").update({
            isNavigationTurnedOn: navigationOnOff
        }).then(() => {
            return agent.add("The navigation was updated.")
        })
    }

    let intentMap = new Map();
    intentMap.set('HeatingOnOff', handleHeating);
    intentMap.set("ACOnOff", handleAC);
    intentMap.set("RadioOnOff", handleTheRadio);
    intentMap.set("HeatingTempValue", HeatingTempValue);
    intentMap.set("SwitchRadioStation", SwitchTheRadio);
    intentMap.set("NavigationCity", NavigateToCity);
    intentMap.set("NavigationOnOff", NavigationOnOff);
    agent.handleRequest(intentMap);
});
