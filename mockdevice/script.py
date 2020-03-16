#!/usr/bin/python3
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    client.subscribe("light")

def on_message(client, userdata, msg):
    print("New Status: " + msg.payload.decode())

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)

client.loop_forever()

