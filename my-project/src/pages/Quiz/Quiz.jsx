const startQuiz = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch('http://localhost:5000/api/v1/ai/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        numberOfQuestions: 5
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch quiz questions');
    }

    const data = await response.json();
    setQuestions(data.questions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setQuizStarted(true);

  } catch (error) {
    console.error('Error fetching questions:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}; 