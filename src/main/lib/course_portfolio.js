const Portfolio = require('../models/CoursePortfolio')
// minimum number of class size >10 to evaluate
const min_num_students = 10
// percentage of students to be evaluated
const eval_perc = .20
module.exports.new = async ({
	department_id,
	course_number,
	instructor,
	semester,
	year,
	num_students,
	student_learning_outcomes,
	section
}) => {
	
	// TODO
	return {
		id: course_number
	};
}

// calculates the number of evaluations needed based on the number of students in the class
// (20% of class size or 10 students. If there are less than 20 students, evaluate all of them)
module.exports.num_evals = (num_students) => {
	if(num_students < 0)
		return "error, must be 0 or more students in a class"
	else
		return Math.min(num_students, (Math.max(eval_perc * num_students, min_num_students)))
}


// Function that takes in the # of required evals and the # of students in a class
// Randomly selects a number associated to a student and adds it into an array of students
module.exports.students_for_evals = (num_evals_req, num_students) => {
	// error case
	if (num_students < num_evals_req)
		return "The number of evaluations must be less than or equal to the number of students"

	var students_to_be_eval = []
	var tempRandom = 0
	var contains = true
	// iterate through the number of evals 
	// this number is determined by num_evals functions
	for (var i = 0; i < num_evals_req; i++) {
		contains = true
		// create a new random, that does not exist in array currently
		while (contains) {
			tempRandom = Math.floor(Math.random() * Math.floor(num_students) +1)
			if (students_to_be_eval.indexOf(tempRandom) == -1) { 
				contains = false
				students_to_be_eval[i] = tempRandom
			}
		}
	}
	return students_to_be_eval
}

// Function takes the number of students who met or exceeded expectations for the class, dividing that by the sample size, and
// then multiplying that by 100 to yield the result (artifact score) as a percent.
module.exports.compute_art_score = (num_met, num_exceeds, sample_size) => {
	if(num_met < 0 || num_exceeds < 0 || num_met < 0)
		return "All input values must be 0 or greater"
	else if(num_met == 0 || num_exceeds == 0 || num_met == 0)
		return 0
	else
		return (Math.round(((num_met + num_exceeds) / sample_size) * 100))
}

// Function takes in a binary array where each value in the array corresponds to an SLO
module.exports.get_SLOs = (SLO_list) => {
	var total_SLOs = ''
	var temp = 0;
	if (SLO_list.length == 0)
		return "Every class has at least one SLO"
	else {
		for (var i in SLO_list) {
			if (SLO_list[i] == 1) {
				temp = Number(i) + 1
				total_SLOs = total_SLOs.concat(temp)
				if (i != SLO_list.length - 1)
					total_SLOs = total_SLOs.concat(' ')
			}
		} 
		return total_SLOs
	}
}

module.exports.get = async (portfolio_id) => {
	let raw_portfolio = await Portfolio.query()
		.eager({
			course: {
				department: true
			},
			instructor: true,
			semester: true,
			outcomes: {
				slo: {
					metrics: true
				},
				artifacts: {
					evaluations: true
				}
			}
		})
		.findById(portfolio_id)

	let portfolio = {
		portfolio_id: raw_portfolio.id,
		course_id: raw_portfolio.course_id,
		instructor: raw_portfolio.instructor,
		num_students: raw_portfolio.num_students,
		outcomes: [],
		course: {
			department: raw_portfolio.course.department.identifier,
			number: raw_portfolio.course.number,
			section: raw_portfolio.section,
			semester: raw_portfolio.semester.value,
			year: raw_portfolio.year
		},
	}

	for (let i in raw_portfolio.outcomes) {
		portfolio.outcomes.push(Object.assign({
			artifacts: raw_portfolio.outcomes[i].artifacts
		}, raw_portfolio.outcomes[i].slo))
	}

	return portfolio
}