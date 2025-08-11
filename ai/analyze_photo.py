import sys
import json
import random

# Placeholder analysis. In a real scenario, use a trained model to inspect the image.
# This stub randomly decides which tasks are needed.


def analyze(path):
    overgrown = random.choice([True, False])
    weeds = random.choice([True, False])
    bushes = random.choice([True, False])

    tasks = []
    if overgrown:
        tasks.append({"task": "Mow", "recommendation": "Mow today"})
    if weeds:
        tasks.append({"task": "Spray", "recommendation": "Spray in 2 days"})
    if bushes:
        tasks.append({"task": "Prune", "recommendation": "Prune next week"})
    if not tasks:
        tasks.append({"task": "None", "recommendation": "No immediate action"})
    return {"tasks": tasks}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image provided"}))
        sys.exit(1)
    result = analyze(sys.argv[1])
    print(json.dumps(result))
