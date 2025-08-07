import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, FormGroup, Label, Input, Button, Form } from "reactstrap";

const SoftwareAssessmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [status, setStatus] = useState("not-started");
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [percentageScore, setPercentageScore] = useState(0);

    useEffect(() => {
        // Fetch questions based on ID, but handle id=5 differently
        const fetchUrl = id === "5"
            ? `http://localhost/backend/routes/fetch_software_questions.php?id=5`
            : `http://localhost/backend/routes/fetch_software_questions.php?id=${id}`;

        fetch(fetchUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.success && Array.isArray(data.questions)) {
                    setQuestions(data.questions);
                    setStatus(data.status);
                    setIsLoading(false);
                } else {
                    console.error("Error fetching questions:", data.error || "Unknown error");
                    setQuestions([]);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                setQuestions([]);
                setIsLoading(false);
            });
    }, [id]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            assessment_id: id,
            user_answers: selectedAnswers,
        };

        fetch("http://localhost/backend/routes/save_result.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then(async (response) => {
                const rawResponse = await response.text();
                console.log("Raw Response:", rawResponse);

                try {
                    const jsonResponse = JSON.parse(rawResponse);
                    if (jsonResponse.success) {
                        setIsSubmitted(true);
                        setScore(jsonResponse.result.score);
                        setTotalQuestions(jsonResponse.result.totalQuestions);
                        setPercentageScore(jsonResponse.result.percentageScore);
                        setStatus(jsonResponse.result.status);

                        navigate("/result-soft", {
                            state: {
                                score: jsonResponse.result.score,
                                totalQuestions: jsonResponse.result.totalQuestions,
                                percentageScore: jsonResponse.result.percentageScore,
                                status: jsonResponse.result.status,
                            }
                        });
                    } else {
                        console.error("API Error:", jsonResponse.error);
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            })
            .catch((error) => {
                console.error("Network Error:", error);
            });
    };

    if (isLoading) return <div>Loading questions...</div>;

    return (
        <div className="container mt-5">
            <h3 className="text-center">Software Assessment {id}</h3>
            <Form onSubmit={handleSubmit}>
                {Array.isArray(questions) && questions.length > 0 ? (
                    questions.map((question) => (
                        <Card key={question.id}>
                            <CardBody>
                                <CardTitle>{question.text}</CardTitle>
                                {Array.isArray(question.options) && question.options.length > 0 ? (
                                    question.options.map((option, index) => (
                                        <FormGroup key={`${question.id}-${index}`}>
                                            <Input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={option}
                                                onChange={() => handleAnswerChange(question.id, option)}
                                                checked={selectedAnswers[question.id] === option}
                                            />
                                            <Label>{option}</Label>
                                        </FormGroup>
                                    ))
                                ) : (
                                    <div>No options available for this question.</div>
                                )}
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <div>No questions available</div>
                )}

                {!isSubmitted && (
                    <div className="text-center">
                        <Button type="submit" color="primary" size="lg">
                            Submit
                        </Button>
                    </div>
                )}
            </Form>

            {isSubmitted && (
                <div className="text-center mt-4">
                    <h4>Assessment Completed!</h4>
                    <p>Status: {status}</p>
                    <p>Your Score: {score}/{totalQuestions}</p>
                    <p>Percentage: {percentageScore}%</p>
                    <Button color="secondary" onClick={() => navigate("/assessment-soft")}>
                        Back to Assessments
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SoftwareAssessmentPage;
