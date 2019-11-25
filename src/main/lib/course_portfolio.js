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