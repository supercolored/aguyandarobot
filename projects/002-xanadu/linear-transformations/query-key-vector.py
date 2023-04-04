import numpy as np

# Example input sentence
sentence = "Tell me about American music ."

# Simple tokenization (splitting the sentence by space)
tokens = sentence.split()

# Example learned linear transformations (randomly generated for simplicity)
query_transform = np.random.rand(3, 3)
key_transform = np.random.rand(3, 3)
value_transform = np.random.rand(3, 3)

# Token-to-vector mapping (one-hot encoding for simplicity)
token_vectors = {
    "Tell": [1, 0, 0],
    "me": [0, 1, 0],
    "about": [0, 0, 1],
    "American": [1, 1, 0],
    "music": [1, 0, 1],
    ".": [0, 1, 1],
}

# Generating query, key, and value vectors for each token
query_vectors, key_vectors, value_vectors = [], [], []

for token in tokens:
    token_vector = token_vectors[token]
    
    # Apply the learned linear transformations (matrix multiplication)
    query_vector = np.dot(token_vector, query_transform)
    key_vector = np.dot(token_vector, key_transform)
    value_vector = np.dot(token_vector, value_transform)

    # Store the generated vectors
    query_vectors.append(query_vector)
    key_vectors.append(key_vector)
    value_vectors.append(value_vector)

# Print the generated query, key, and value vectors
for token, query, key, value in zip(tokens, query_vectors, key_vectors, value_vectors):
    print(f"{token}:")
    print(f"  Query: {query}")
    print(f"  Key: {key}")
    print(f"  Value: {value}")
