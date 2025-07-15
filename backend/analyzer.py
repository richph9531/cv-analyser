import os
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import json

# Check if OpenAI API key is set
if "OPENAI_API_KEY" not in os.environ:
    print("Warning: OPENAI_API_KEY environment variable not set")

def analyze_cv(cv_text, criteria_text=None):
    """
    Analyze a CV against specified criteria
    
    Args:
        cv_text (str): The extracted text from the CV
        criteria_text (str): The criteria to evaluate against (What does good look like)
        
    Returns:
        dict: Analysis results including pass/fail and confidence score
    """
    # If no criteria provided, try to load from file
    if not criteria_text:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        criteria_path = os.path.join(base_dir, 'data', 'criteria.json')
        if os.path.exists(criteria_path):
            with open(criteria_path, 'r') as f:
                criteria_data = json.load(f)
                criteria_text = criteria_data.get('criteria', '')
    
    # If still no criteria, use a default
    if not criteria_text:
        criteria_text = """
        What good looks like in a QA Engineer:

        Has a shift left mentality, focusing on risk mitigation by identifying potential defects early in the process. Is quality-focused, considering testability across all phases of the software development life cycle. Deep knowledge of test methodologies and can apply that knowledge appropriately in a wide array of contexts. [QUALITY FOCUSED]
        
        Has a wide range of testing skills, knows when and where to apply them, and when to take a different approach. Has a deep appreciation for a wide range of non-functional testing concerns. Can collaborate and support the team to define non-functional requirements and enable implementation. [TESTING KNOWLEDGE]
        
        Is team focused and seeks to enable them to deliver quality products / services. Sees testing as a team activity and can facilitate and coordinate these tasks. Not only shares knowledge but receives it. Acts as a catalyst for mediation and collaboration within the team. [COLLABORATIVE]
        
        Can call upon a wide range of testing tools, is framework agnostic and has the ability to decide on the right tool for the use case. Can contribute to discussions regarding application architecture and understand the implications of those decisions on quality. Has an appreciation for the benefits of continuous delivery and continuous integration. Can contribute to the implementation and design of high quality pipelines. [TEST ARCHITECTURE, TOOLING AND PIPELINE]
        
        Has experience with multiple languages and can adopt new ones quickly. Understands modern coding practices and appreciates clean code. Has experience contributing to production and test code bases. Has debugging and diagnostic experience. Works with the team getting involved in collaborative programming. [DEVELOPMENT SKILLS]
        
        Is pragmatic, adaptable, self organizing and knows how much to test and when to stop. Does not become a quality gateway. Enabling the team's needs with their expertise and seeking help when required. Able to work independently and asynchronously of others. [ADAPTABLE]
        
        Helps clients navigate the journey towards their goals. Shows empathy for the client's current position and the journey that they have taken. They understand the why and know how to deliver value. They have a holistic awareness of the clients needs to enable them to deliver the right solution. Demonstrates diplomacy and actively seeks to help the client. [CLIENT FOCUSED]
        
        Has an analytical mindset and is naturally inquisitive. Pays attention to detail and demonstrates the ability to zoom out to the holistic view. Is well organized and consistent. Has a passion for continual learning and is able to pick up on new technologies, frameworks and domains quickly. [ANALYTICAL]
        
        Actively shares concepts such as ways of working, new tools and techniques with the team, the client and the wider network. Seeks advice when needed. Continually looking for opportunities to coach/mentor others and gets involved in facilitating or creating communities. [COMMUNITY]
        """
    
    # Prepare the prompt template
    template = """
    You are a thorough and fair technical recruiter specializing in Quality Assurance Engineer roles. You have high standards but also recognize that CVs often don't capture every detail of a candidate's experience.
    
    Below is the text extracted from a candidate's CV:
    
    {cv_text}
    
    And here are the criteria for what makes a good QA Engineer candidate:
    
    {criteria_text}
    
    BALANCED EVALUATION INSTRUCTIONS - FOLLOW THESE EXACTLY:
    - Be thorough and critical in your evaluation, but also fair and realistic
    - For a candidate to PASS, they must meet ALL of the following criteria WITHOUT EXCEPTION:
      1. NO areas assessed as "Weak evidence" or "No evidence" - ANY WEAK OR NO EVIDENCE MEANS AUTOMATIC FAIL
      2. Each of the 9 categories must have at least "Moderate evidence"
      3. At least FOUR categories must be rated as "Strong evidence"
      4. "TESTING_KNOWLEDGE" and "QUALITY_FOCUSED" MUST be among the categories with "Strong evidence"
    - Look for both explicit evidence and reasonable inferences based on related experience
    - Specific examples and achievements are valuable, but recognize that CVs are limited in space
    - Generic statements should be evaluated in context of the overall CV and experience level
    - Consider both the breadth and depth of experience appropriate to their career stage
    - Look for indicators of impact and results, even if not explicitly quantified
    - Confidence scores should be assigned as follows:
      * 90-100%: Exceptional evidence in 6+ categories with measurable achievements
      * 80-89%: Strong evidence in 5+ categories with specific examples
      * 70-79%: Strong evidence in exactly 4 categories including the required ones
      * Below 70%: Automatic FAIL
    - Pay particular attention to evidence for testing knowledge, quality focus, and analytical skills
    - IMPORTANT: Double-check your assessment before finalizing. The candidate MUST FAIL if ANY of these conditions are not met:
      1. No weak or missing evidence in any category (ANY "Weak evidence" or "No evidence" means AUTOMATIC FAIL)
      2. At least moderate evidence in all categories
      3. Strong evidence in at least four categories
      4. Both "TESTING_KNOWLEDGE" and "QUALITY_FOCUSED" must have strong evidence
    
    For each criterion, explicitly note whether there is:
    - Strong evidence (MUST have specific examples with measurable outcomes or achievements)
    - Moderate evidence (mentioned with some context or can be reasonably inferred)
    - Weak evidence (briefly mentioned without context)
    - No evidence (not addressed at all)
    
    IMPORTANT: For "Strong evidence" rating, the CV MUST contain concrete examples with specific details, not just generic statements. Look for metrics, project specifics, or clear descriptions of methodologies used.
    
    Please analyze this CV against the criteria and provide:
    1. A determination if the candidate passes or fails based on the criteria (PASS/FAIL)
    2. A confidence score from 0-100% on your determination
    3. A detailed justification for your decision (maximum 5 bullet points)
    4. Key strengths of the candidate (maximum 3)
    5. Key areas for improvement (maximum 3)
    6. A detailed assessment for each of the 9 WGLL categories (QUALITY FOCUSED, TESTING KNOWLEDGE, COLLABORATIVE, etc.)
    
    Format your response as a JSON object with the following structure:
    {{
        "decision": "PASS" or "FAIL",
        "confidence": 85,
        "justification": ["point 1", "point 2", ...],
        "strengths": ["strength 1", "strength 2", ...],
        "improvement_areas": ["area 1", "area 2", ...],
        "category_assessments": {{
            "QUALITY_FOCUSED": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "TESTING_KNOWLEDGE": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "COLLABORATIVE": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "TEST_ARCHITECTURE": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "DEVELOPMENT_SKILLS": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "ADAPTABLE": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "CLIENT_FOCUSED": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "ANALYTICAL": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }},
            "COMMUNITY": {{
                "rating": "Strong/Weak/No Evidence",
                "assessment": "Detailed assessment of this category based on CV evidence"
            }}
        }}
    }}
    
    Return ONLY the JSON object, nothing else.
    """
    
    prompt = PromptTemplate(
        input_variables=["cv_text", "criteria_text"],
        template=template
    )
    
    try:
        # Check if OpenAI API key is properly set
        if not os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENAI_API_KEY").startswith("sk-your-"):
            raise ValueError("OpenAI API key is not properly configured. Please add a valid API key to the .env file.")
            
        # Initialize with ChatOpenAI which is compatible with current models
        llm = ChatOpenAI(temperature=0.3, model_name="gpt-3.5-turbo")
        
        # Create and run the chain
        chain = LLMChain(llm=llm, prompt=prompt)
        response = chain.run(cv_text=cv_text, criteria_text=criteria_text)
        
        # Parse the JSON response
        result = json.loads(response)
        
        # Validate the result against our rules
        return validate_and_correct_result(result)
    
    except Exception as e:
        print(f"Error analyzing CV: {e}")
        # Return a fallback response
        return fallback_response(str(e))


def validate_and_correct_result(result):
    """
    Validates the AI-generated result against our rules and corrects it if necessary.
    Rules for PASS:
    1. NO areas assessed as "Weak evidence" or "No evidence"
    2. Each category must have at least "Moderate evidence"
    3. At least FOUR categories must be rated as "Strong evidence"
    4. "TESTING_KNOWLEDGE" and "QUALITY_FOCUSED" MUST be among the categories with "Strong evidence"
    """
    try:
        # Extract the assessment data
        assessment = result.get('assessment', {})
        categories = assessment.get('categories', {})
        
        # Count the evidence levels
        weak_or_no_evidence = False
        strong_evidence_count = 0
        testing_knowledge_strong = False
        quality_focused_strong = False
        
        # Check each category
        for category, data in categories.items():
            rating = data.get('rating', '').lower()
            
            # Check for weak or no evidence
            if 'weak' in rating or 'no' in rating:
                weak_or_no_evidence = True
            
            # Count strong evidence
            if 'strong' in rating:
                strong_evidence_count += 1
                
                # Check specific required categories
                if category == 'TESTING_KNOWLEDGE':
                    testing_knowledge_strong = True
                elif category == 'QUALITY_FOCUSED':
                    quality_focused_strong = True
        
        # Apply the rules
        should_pass = (
            not weak_or_no_evidence and
            strong_evidence_count >= 4 and
            testing_knowledge_strong and
            quality_focused_strong
        )
        
        # Override the result if necessary
        if result.get('pass') != should_pass:
            print(f"Correcting pass/fail assessment. AI said: {result.get('pass')}, Rules say: {should_pass}")
            result['pass'] = should_pass
            
            # Adjust confidence if needed
            if not should_pass and result.get('confidence', 0) > 69:
                result['confidence'] = 69  # Below 70% is automatic fail
            
            # Add a note about the correction
            if 'justification' in result:
                correction_note = "[NOTE: This assessment was automatically corrected to follow the strict evaluation criteria. Any category with 'Weak evidence' or 'No evidence' results in an automatic fail.]"
                
                # Handle different justification formats
                if isinstance(result['justification'], list):
                    result['justification'].append(correction_note)
                elif isinstance(result['justification'], str):
                    result['justification'] = result['justification'] + "\n\n" + correction_note
                else:
                    # If it's neither a list nor a string, convert to a list
                    result['justification'] = [str(result['justification']), correction_note]
        
        return result
    
    except Exception as e:
        print(f"Error validating result: {e}")
        # Return the original result if validation fails
        return result


def fallback_response(error_msg):
    return {
        "decision": "ERROR",
        "confidence": 0,
        "justification": [f"Error analyzing CV: {error_msg}"],
        "strengths": [],
        "improvement_areas": ["Could not analyze CV properly"]
    }
