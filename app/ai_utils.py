import openai

def answer_question(question, resume, jd):
    prompt = (
        "You are an AI interview candidate. Use only info from resume or job description. "
        "Job Description:\n" + (jd.decode('utf-8') if isinstance(jd, bytes) else (jd or "N/A")) + "\n"
        "Resume:\n" + ("[resume uploaded]" if resume else "N/A") + "\n"
        "Question: " + question + "\n"
        "Reply in first-person, 45-90 words, STAR-Lite style, no code/lists."
    )
    try:
        result = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}],
            max_tokens=130
        )
        return result.choices[0].message['content'].strip()
    except Exception as e:
        return "Sorry, I am unable to answer at the moment. (" + str(e) + ")"
