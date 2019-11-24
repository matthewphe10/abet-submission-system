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
	return Math.min(num_students, (Math.max(eval_perc * num_students), min_num_students))
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