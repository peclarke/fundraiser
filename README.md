# Fundraiser Platform

Software that can be used by staff members at fundraisers to update donations in real time to those at an event. This was initially created in preparation for a fundraiser I'm going to be co-hosting. 

<img width="1452" alt="Screen Shot 2024-04-26 at 11 18 47 pm" src="https://github.com/peclarke/fundraiser/assets/30831649/616ee526-cef0-4db9-8b30-2bcbc99dd214">
<img width="1050" alt="Screen Shot 2024-04-26 at 11 18 34 pm" src="https://github.com/peclarke/fundraiser/assets/30831649/b6931bb8-3064-4eed-afe5-2500bd93a8e9">

## Features
- Admin Portal for donation entries and milestone management
- Display screen to either link people to or display on a large screen

## Drawbacks
- There is no authentication to the admin portal at the moment. While there is no sensitive information being used here - this is simply used as a way to display progress - security wasn't in the initial scope.

## How To Use
This software uses **Donations** and **Milestones**. Milestones are achieved when enough donations are made to reach a goal.
Staff members can manage the system through the `/admin` endpoint. All other endpoints - including the root, `/` - will route to the display screen.

### TODO
- Add some user/pass auth on admin portal
- Add milestone management
- Docker-compose the entire application

### Not planned
- Multiple donation campaigns within the same platform.
- Third party user base. Each instance of the app is standalone and authenticatio details will be specific to that instance.
