# Frontend Assignment — Multi-Step Travel Visa Application Wizard

## The Challenge

Your task is to build a **Multi-Step Travel Visa Application Wizard** using **Vue 3** or **Nuxt 4** (your choice). The app integrates with the [REST Countries API](https://restcountries.com/) to pull country data and displays it as demonstrated in the provided design.

You will find a desktop version of the design in the Figma link below. Note that the final implementation doesn't have to be pixel perfect — anything close to the design will suffice.

## Design

📐 **Figma Link:** https://www.figma.com/design/1wJ992K36TH6mcWpm25HwT/JW---Frontend-Assignment

The design is provided for desktop (`1440px`).

## Constraints & Allowed Tools

You have complete control over which packages you use for HTTP requests, validation, or utilities. However, **do not use a pre-built UI component library** (Vuetify, Element Plus, PrimeVue, etc.). Headless libraries (like Headless UI) are allowed.

## The App

### Wizard Section

#### Step 1 — Country Selection

- Select a country of citizenship and a destination country
- Both fields should be searchable dropdowns populated from the REST Countries API
- Display the selected country's flag, common name, and capital beside each selection
- User cannot select the same country for both fields

#### Step 2 — Personal Details

- Input fields: Full Name, Email, Phone Number, Date of Birth, Passport Number
- All fields are required with appropriate validation
- Phone number field should show the calling code prefix based on the citizenship country from Step 1 (available in the API response under `idd`)

#### Step 3 — Review & Submit

- Read-only summary of all data from Steps 1 and 2
- Show both countries with their flag, region, population, and languages (all available in the API response)
- A "Submit Application" button that adds the application to the list below
- After a successful submission, the wizard resets back to Step 1 with empty fields, ready for a new application

### Applications List Section

Below the wizard, display a list of submitted applications showing:

- Citizenship and destination country (with flags)
- Applicant name
- Submission date
- A status badge (Pending / Approved / Rejected — can be randomly assigned or toggled)

Each new successful submission should appear in this list. The list should persist during the session.

## Your Users Should Be Able To

- Search and select countries using a searchable dropdown
- Navigate between wizard steps freely without losing filled data
- See inline validation errors when trying to advance with incomplete or invalid fields
- Submit an application and see it appear in the applications list below

## Project Bonuses (Optional)

- **Bonus:** Fuzzy search in country dropdowns — typing `Grmany` or `Untd Stats` should still find the correct result
- **Bonus:** Transitions and animations between wizard steps
- **Bonus:** Unit tests for at least one component and one composable or utility function
- **Bonus:** Implement form validation without a validation library
- **Bonus:** Dockerize your application with an efficient Dockerfile

## Deploying Your Project

There are a number of ways to host your project for free (Vercel, Netlify, Railway, etc.). Please choose one and deploy it somewhere accessible.

## Sharing Your Solution

The repository needs to have an updated `README.md` file that includes:

- Setup and installation instructions
- Key architecture decisions you made
- A link to the live demo
