import streamlit as st
import google.generativeai as genai
import os

# 1. Setup the page
st.set_page_config(page_title="My AI App")
st.title("Chat with Gemini AI")

# 2. Get the API Key safely
# This looks for the key in Streamlit's secrets (we will set this next!)
api_key = st.secrets["GEMINI_API_KEY"]

# 3. Configure the model
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')

# 4. Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# 5. Display previous messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 6. React to user input
if prompt := st.chat_input("What is up?"):
    # Display user message
    with st.chat_message("user"):
        st.markdown(prompt)
    # Add to history
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Generate response
    with st.chat_message("assistant"):
        response = model.generate_content(prompt)
        st.markdown(response.text)
    
    # Add response to history
    st.session_state.messages.append({"role": "model", "content": response.text})
