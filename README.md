
# Budgety app
> A budgeting app inspired being a treasurer for a public speaking club.

### Demo
Try it out https://budgety-app-jp.herokuapp.com/ <br>
email: test@<span>example.com</span>\
password: test123

## Table of contents
* [General info](#general-info)
* [Features](#features)
* [Samples](#samples)
* [Technologies](#technologies)
* [Challenges](#challenges)

## General info
In a club cash can flow through many mediums such as online banking and cash payments. Most clubs use excel spreadsheets to manage their budget and present to meetings. They sought to display the cash flows noted by its source in a readable and analyitic manner. Committee members also require readable access to these spreadsheets which together with updating and uploading the file for each transaction, the whole process becomes inconvenient and bothersome.\
\
I saw this as an opportunity to upgrade the old tech into a web application accessible to everyone. \
Budgety-app can be used by anyone, for clubs, household or work related.

### Features
- Creating multiple budgets.
- Adding transactions to the budget.
- Bar graph of budget balance by year.
- Pie graph of income and expenses by transaction category (eg. club rent, membership).
- Full user authentication.

## Samples
#### Desktop-view
https://user-images.githubusercontent.com/47600145/116779967-f024b880-aaab-11eb-997d-1277a176724e.mp4

#### Mobile-view
https://user-images.githubusercontent.com/47600145/116780153-4514fe80-aaad-11eb-88a9-ee4b51d92a51.mp4

## Technologies
* React - javascript framework/library.
* Redux - for global state management (useful in keeping track of editor state).
* Typescript - static type checking with JavaScript.
* D3.js - interactive data driven visualisations.
* Sass - CSS preprocessor with responsive CSS grid design.
* MongoDB - NoSQL database that is easily scalable.
* Express.js - popular node.js framework for creating REST api.

## Challenges
- BudgetSchema - MongoDB aggregation pipeline in relation to updating an ordered array and looping each item to attain the current balance.
- D3.js - data driven graphs have limitations and constraints have to be added such as limited number of categories.
- Data architecture - extensive data is required by each feature and even some, require to be strict. Categories for example can be edited however, cannot be deleted because this will leave the current transactions under the same category left unassigned.
- User experience - to achieve a smooth user experience, mobile and desktop view have different displays however, the features have been designed to be applicable for both displays. For example to edit a transaction, the user simply have to either double click or tap on a transaction entry.


