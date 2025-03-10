const course_portfolio = require('../../../main/lib/course_portfolio')
const { expect } = require('../../chai')
const sinon = require('sinon')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();



describe('Lib - CoursePortfolio', () => {


	describe('num_evals', () => {
		// this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the num_evals model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
		})

		it('Returns error with negative number', () =>{
			expect(course_portfolio.num_evals(-1)).to.equal("error, must be 0 or more students in a class")
		})

		it('Returns zero with zero as input', () =>{
			expect(course_portfolio.num_evals(0)).to.equal(0)
		})

		it('Returns 5 with class size of 5', () =>{
			expect(course_portfolio.num_evals(5)).to.equal(5)
		})

		it('Returns 10 with input > 10 but 20% of input less than 10', () =>{
			expect(course_portfolio.num_evals(14)).to.equal(10)
		})

		it('Returns 20% of class size with input > 10 and 20% of input greater than 10', () =>{
			expect(course_portfolio.num_evals(100)).to.equal(20)
		})
	})

	describe('students_for_evals', () => {
		// this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the num_evals model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
		})

		it('# of evals greater than # of students', () => {
			//arrange
			const expected_output = "The number of evaluations must be less than or equal to the number of students"
			//act 
			const actual_output = course_portfolio.students_for_evals(3, 2)
			//assert
			expect(actual_output).to.equal(expected_output)
		})

		it('# of evals equal to # of students', () => {
			//arrange
			const expected_output = [1, 2, 3]
			const stub = sandbox.stub(Math, "random")
			stub.onCall(0).returns(0)
			stub.onCall(1).returns(1/3)
			stub.onCall(2).returns(2/3)

			//act
			const actual_output = course_portfolio.students_for_evals(3, 3)

			// assert
			expect(actual_output).to.deep.equal(expected_output)
		})

		it('# of evals less than to # of students', () => {
			//arrange
			const expected_output = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
			const stub = sandbox.stub(Math, "random")
			stub.onCall(0).returns(0)
			stub.onCall(1).returns(.1)
			stub.onCall(2).returns(.2)
			stub.onCall(3).returns(.3)
			stub.onCall(4).returns(.4)
			stub.onCall(5).returns(.5)
			stub.onCall(6).returns(.6)
			stub.onCall(7).returns(.7)
			stub.onCall(8).returns(.8)
			stub.onCall(9).returns(.9)

			//act
			const actual_output = course_portfolio.students_for_evals(10, 20)

			// assert
			expect(actual_output).to.deep.equal(expected_output)
		})
	})

	describe('compute_art_score', () => {
		// this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the num_evals model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
		})

		it('Returns error message with negative number', () =>{
			expect(course_portfolio.compute_art_score(-1, -2, -3)).to.equal("All input values must be 0 or greater")
		})

		it('Returns zero with any zero as input', () =>{
			expect(course_portfolio.compute_art_score(0, 1, 2)).to.equal(0)
		})

		it('Returns correct evaluation percentage', () =>{
			expect(course_portfolio.compute_art_score(12, 1, 15)).to.equal(87)
		})
	})

	describe('get_SLOs', () => {
		// this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the num_evals model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
		})

		const inputZero = []
		const input = [1, 0, 1, 0, 0, 1]
		
		it('Returns error message when no SLOs are provided', () => {
			expect(course_portfolio.get_SLOs(inputZero)).to.equal("Every class has at least one SLO")
		})

		it('Returns the SLOs for the given class', () => {
			expect(course_portfolio.get_SLOs(input)).to.equal("1 3 6")
		})
	})
		
	describe('get', () => {

		// this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
		})

		it('with id', async () => {
			// Arrange
			const CoursePortfolio = require('../../../main/models/CoursePortfolio')

			// stub the CoursePortfolio.query() method
			sandbox.stub(CoursePortfolio, "query").returns({
				// stub the CoursePortfolio.query().eager() method
				eager: sandbox.stub().returns({
					// stub the CoursePortfolio.query().eager().findById() method
					findById: sinon.stub().returns({
						"id": 1,
						"course_id": 1,
						"instructor_id": 1,
						"semester_term_id": 1,
						"num_students": 5,
						"section": 1,
						"year": 2019,
						"course": {
							"id": 1,
							"department_id": 1,
							"number": 498,
							"department": {
								"id": 1,
								"identifier": "cs",
								"name": "Computer Science"
							}
						},
						"instructor": {
							"id": 1,
							"linkblue_username": "user"
						},
						"semester": {
							"id": 1,
							"type": 1,
							"value": "fall"
						},
						"outcomes": [
							{
								"id": 1,
								"portfolio_id": 1,
								"slo_id": 1,
								"slo": {
									"id": 1,
									"department_id": 1,
									"index": 2,
									"description": "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
									"metrics": [
										{
											"id": 1,
											"slo_id": 1,
											"index": 1,
											"name": "Identify and interpret client needs and design constraints",
											"exceeds": "n/a",
											"meets": "n/a",
											"partially": "n/a",
											"not": "n/a"
										}
									]
								},
								"artifacts": [
									{
										"id": 1,
										"portfolio_slo_id": 1,
										"index": 1,
										"name": "_unset_",
										"evaluations": [
											{
												"id": 1,
												"artifact_id": 1,
												"evaluation_index": 1,
												"student_index": 1,
												"evaluation": [],
												"file": null
											}
										]
									},
									{
										"id": 2,
										"portfolio_slo_id": 1,
										"index": 2,
										"name": "_unset_",
										"evaluations": [
											{
												"id": 6,
												"artifact_id": 2,
												"evaluation_index": 1,
												"student_index": 1,
												"evaluation": [],
												"file": null
											}
										]
									},
									{
										"id": 3,
										"portfolio_slo_id": 1,
										"index": 3,
										"name": "_unset_",
										"evaluations": [
											{
												"id": 11,
												"artifact_id": 3,
												"evaluation_index": 1,
												"student_index": 1,
												"evaluation": [],
												"file": null
											}
										]
									}
								]
							}
						]
					})
				})
			})

			// Act
			const portfolio = await course_portfolio.get(1)

			// Assert
			expect(portfolio).to.deep.equal({
				"portfolio_id": 1,
				"course_id": 1,
				"instructor": {
					"id": 1,
					"linkblue_username": "user"
				},
				"num_students": 5,
				"outcomes": [
					{
						"artifacts": [
							{
								"id": 1,
								"portfolio_slo_id": 1,
								"index": 1,
								"name": "_unset_",
								"evaluations": [
									{
										"id": 1,
										"artifact_id": 1,
										"evaluation_index": 1,
										"student_index": 1,
										"evaluation": [],
										"file": null
									}
								]
							},
							{
								"id": 2,
								"portfolio_slo_id": 1,
								"index": 2,
								"name": "_unset_",
								"evaluations": [
									{
										"id": 6,
										"artifact_id": 2,
										"evaluation_index": 1,
										"student_index": 1,
										"evaluation": [],
										"file": null
									}
								]
							},
							{
								"id": 3,
								"portfolio_slo_id": 1,
								"index": 3,
								"name": "_unset_",
								"evaluations": [
									{
										"id": 11,
										"artifact_id": 3,
										"evaluation_index": 1,
										"student_index": 1,
										"evaluation": [],
										"file": null
									}
								]
							}
						],
						"id": 1,
						"department_id": 1,
						"index": 2,
						"description": "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
						"metrics": [
							{
								"id": 1,
								"slo_id": 1,
								"index": 1,
								"name": "Identify and interpret client needs and design constraints",
								"exceeds": "n/a",
								"meets": "n/a",
								"partially": "n/a",
								"not": "n/a"
							}
						]
					}
				],
				"course": {
					"department": "cs",
					"number": 498,
					"section": 1,
					"semester": "fall",
					"year": 2019
				}
			})
		})

	})

})