# bot/app.py
import os, json, re, requests
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

OPENAI_AGENT_ENDPOINT = os.getenv("AGENT_URL")  # http://agentic-ai:8080/run

app = App(token=os.environ["SLACK_BOT_TOKEN"])

DISK_REGEX = re.compile(r"(?P<mount>/\w+) (by|to) (?P<size>\d+)\s?GB", re.I)

@app.message(re.compile("increase .*", re.I))
def handle_increase(message, say):
    text = message["text"]
    m = DISK_REGEX.search(text)
    if not m:
        say("Sorry, I couldn’t parse that. Try: *increase /var by 15 GB*")
        return
    payload = {
        "intent": "fs_expand",
        "mountpoint": m.group("mount"),
        "size_gb": int(m.group("size")),
        "user": message["user"],
        "host": "srv-db-01"   # demo: map channel→host if you like
    }
    say(f"Got it! Let me check and run that… :hourglass_flowing_sand:")
    resp = requests.post(OPENAI_AGENT_ENDPOINT, json=payload, timeout=300)
    say(resp.json()["message"])

if __name__ == "__main__":
    SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"]).start()

