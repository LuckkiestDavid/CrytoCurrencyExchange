const simpleGit = require("simple-git");
const moment = require("moment");
const faker = require("faker");

// Initialize git instance
const git = simpleGit();

// Define holiday dates (format: YYYY-MM-DD)
// You can extend this list with specific holidays you don't want commits to fall on.
const holidays = [
	"2023-12-25",
	"2023-12-31" // Example holidays (Christmas, New Year)
	// Add other holidays here
];

// Helper function to check if a given date is a weekend or holiday
function isWeekendOrHoliday(date) {
	const dayOfWeek = moment(date).day(); // 0 = Sunday, 6 = Saturday
	const dateString = moment(date).format("YYYY-MM-DD");
	return dayOfWeek === 0 || dayOfWeek === 6 || holidays.includes(dateString);
}

// Function to generate a random date within the specified range (ignores weekends/holidays)
function getRandomDate(startDate, endDate) {
	let date;
	do {
		date = moment(startDate).add(
			Math.random() * (endDate - startDate),
			"milliseconds"
		);
	} while (isWeekendOrHoliday(date));
	return date;
}

// Function to make a commit with a random message
function makeCommit(date) {
	// Set the commit date
	const commitDate = date.format("YYYY-MM-DD HH:mm:ss");
	git.raw([
		"commit",
		"--allow-empty",
		"--date",
		commitDate,
		"-m",
		faker.lorem.sentence()
	]);
}

// Main function to create fake commits
async function createFakeCommits() {
	const startDate = moment("2017-05-06");
	const endDate = moment("2025-01-10");
	const totalCommits = 1000; // Adjust number of commits as needed

	// Ensure the repository is clean and initialized
	await git.init();
	await git.add(".");

	for (let i = 0; i < totalCommits; i++) {
		// Generate a random date within the range
		const randomDate = getRandomDate(startDate, endDate);
		console.log(`Making commit on: ${randomDate.format("YYYY-MM-DD")}`);
		makeCommit(randomDate);
		// Simulate some delay between commits
		await new Promise(resolve => setTimeout(resolve, 500)); // 1 second delay
	}

	console.log("Finished creating fake commits!");
}

// Run the script

// Run the script
createFakeCommits().catch(console.error);
