# MetroTransit
This project tells the user in how much time will the next bus leave from the **bustop** on **route** and going in **direction**.
The project has been created using MetroTransit Public API: http://svc.metrotransit.org/

### Pre-requisites
* Node
* NPM
* Redis

### Setup:
Run `npm i`, to install dependencies

### Run:
Params expected are
- route name
- stop name
- direction

`npm start "METRO Blue Line" "Target Field Station Platform 1" "south"`

### Test:
Run `npm test`
