/**
 * Complete Usage Example for DarkSignals AI Model
 * Demonstrates all features and capabilities
 */

// ============================================
// 1. BASIC INITIALIZATION
// ============================================

const aiModel = new AIModel({
  maxMemorySize: 1000,
  cacheSize: 500,
  wikiTimeout: 5000,
  enableLogging: true
});

// Initialize advanced components
const analytics = new AdvancedAnalytics();
const queryProcessor = new QueryProcessor(aiModel);
const memorySystem = new MemorySystem({
  shortTermSize: 50,
  longTermSize: 500,
  episodicMemorySize: 100
});

// ============================================
// 2. SIMPLE QUESTION ANSWERING
// ============================================

async function example_basicQuestion() {
  console.log('\n=== EXAMPLE 1: Basic Question ===\n');
  
  const answer = await aiModel.askQuestion('What is artificial intelligence?');
  console.log('Question: What is artificial intelligence?');
  console.log('Answer:', answer.answer);
  console.log('Confidence:', answer.confidence);
  console.log('Sources:', answer.sources);
}

// ============================================
// 3. MULTIPLE QUESTIONS AT ONCE
// ============================================

async function example_multipleQuestions() {
  console.log('\n=== EXAMPLE 2: Multiple Questions ===\n');
  
  const questions = [
    'What is machine learning?',
    'What is natural language processing?',
    'What is deep learning?'
  ];

  const results = await aiModel.askMultipleQuestions(questions);
  console.log(`Processed ${results.totalQuestions} questions`);
  console.log(`Successful: ${results.successfulAnswers}`);
  results.results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.success ? '✓' : '✗'} ${result.answer || result.error}`);
  });
}

// ============================================
// 4. COMPLEX QUERY PROCESSING
// ============================================

async function example_complexQuery() {
  console.log('\n=== EXAMPLE 3: Complex Query ===\n');
  
  const complexQuery = 'What is machine learning and how does it work?';
  const result = await queryProcessor.processQuery(complexQuery);

  console.log('Complex Query:', complexQuery);
  console.log('Sub-questions:', result.subQuestions);
  console.log('\nSynthesized Answer:');
  console.log(JSON.stringify(result.synthesizedAnswer, null, 2));
}

// ============================================
// 5. TEXT ANALYSIS
// ============================================

async function example_textAnalysis() {
  console.log('\n=== EXAMPLE 4: Text Analysis ===\n');
  
  const text = 'Artificial Intelligence and Machine Learning are revolutionizing technology. ' +
               'AI systems can learn from data and improve over time without explicit programming.';

  const analysis = await analytics.analyzeText(text);
  
  console.log('Text:', text);
  console.log('\nSemantic Analysis:');
  console.log('- Meanings:', analysis.semantic.meanings);
  console.log('- Dominant Theme:', analysis.semantic.dominantTheme);
  
  console.log('\nEntity Recognition:');
  console.log('- Organizations:', analysis.entities.organizations);
  console.log('- Dates:', analysis.entities.dates);
  
  console.log('\nSentiment Analysis:');
  console.log('- Sentiment:', analysis.sentiment.sentiment);
  console.log('- Score:', analysis.sentiment.score);
  
  console.log('\nReadability:');
  console.log('- Level:', analysis.complexity.level);
  console.log('- Score:', analysis.complexity.score);
}

// ============================================
// 6. GRAMMAR VALIDATION
// ============================================

async function example_grammarValidation() {
  console.log('\n=== EXAMPLE 5: Grammar Validation ===\n');
  
  const texts = [
    'its a beautiful day',
    'Their going to the store',
    'you\'re answer is correct'
  ];

  for (const text of texts) {
    const validation = await aiModel.validateGrammar(text);
    console.log(`\nText: "${text}"`);
    console.log('Correct:', validation.isCorrect);
    if (!validation.isCorrect) {
      console.log('Corrections:', validation.corrections);
    }
  }
}

// ============================================
// 7. MEMORY SYSTEM USAGE
// ============================================

async function example_memorySystem() {
  console.log('\n=== EXAMPLE 6: Memory System ===\n');
  
  // Store in different memory types
  memorySystem.store('What is JavaScript?', 'short-term');
  memorySystem.store({ concept: 'AI', definition: 'Artificial Intelligence' }, 'semantic');
  memorySystem.store({ 
    description: 'User learned about machine learning', 
    context: { topic: 'ML' } 
  }, 'episodic');

  // Retrieve from memory
  const shortTermResults = memorySystem.retrieve('JavaScript', 'short-term');
  console.log('Short-term memory results:', shortTermResults.shortTerm);

  // Get memory statistics
  const stats = memorySystem.getStats();
  console.log('\nMemory Statistics:');
  console.log(JSON.stringify(stats, null, 2));
}

// ============================================
// 8. CONTEXT-AWARE CONVERSATION
// ============================================

async function example_contextAwareConversation() {
  console.log('\n=== EXAMPLE 7: Context-Aware Conversation ===\n');
  
  const conversationContext = { subject: 'machine learning', difficulty: 'advanced' };
  
  const answer1 = await queryProcessor.processWithContext(
    'Explain the basics',
    conversationContext
  );

  console.log('Question: Explain the basics');
  console.log('Answer:', answer1.answer);
  console.log('(Answer is contextualized with topic: machine learning)');
}

// ============================================
// 9. QUERY OPTIMIZATION
// ============================================

async function example_queryOptimization() {
  console.log('\n=== EXAMPLE 8: Query Optimization ===\n');
  
  const queryOptimizer = new QueryOptimizer();
  
  const messyQuery = 'um, could you please explain what is AI? like, you know?';
  const optimized = queryOptimizer.optimize(messyQuery);

  console.log('Original Query:', messyQuery);
  console.log('Optimized Query:', optimized);
}

// ============================================
// 10. BATCH PROCESSING
// ============================================

async function example_batchProcessing() {
  console.log('\n=== EXAMPLE 9: Batch Processing ===\n');
  
  const queries = [
    'What is Python?',
    'What is JavaScript?',
    'What is TypeScript?'
  ];

  const batchResults = await queryProcessor.batchProcess(queries);
  console.log(`Batch Results:
  - Total Queries: ${batchResults.total}
  - Processed: ${batchResults.processed}
  - Failed: ${batchResults.failed}`);
}

// ============================================
// 11. CONVERSATION HISTORY
// ============================================

async function example_conversationHistory() {
  console.log('\n=== EXAMPLE 10: Conversation History ===\n');
  
  // Ask a few questions
  await aiModel.askQuestion('What is web development?');
  await aiModel.askQuestion('What is backend development?');
  await aiModel.askQuestion('What is frontend development?');

  // Retrieve history
  const history = aiModel.getConversationHistory(3);
  console.log('Last 3 questions:');
  history.forEach((entry, index) => {
    console.log(`${index + 1}. Q: ${entry.question}`);
  });
}

// ============================================
// 12. COMPARE MULTIPLE ANSWERS
// ============================================

async function example_compareAnswers() {
  console.log('\n=== EXAMPLE 11: Compare Answers ===\n');
  
  const answers = [
    {
      text: 'AI is the simulation of human intelligence by machines',
      confidence: 0.9
    },
    {
      text: 'Artificial Intelligence refers to computer systems designed to perform tasks',
      confidence: 0.85
    },
    {
      text: 'AI involves machine learning and neural networks',
      confidence: 0.8
    }
  ];

  const comparison = queryProcessor.compareAnswers(answers);
  console.log('Answer Comparison:');
  console.log('- Similarities:', comparison.similarities);
  console.log('- Consensus:', comparison.consensus);
  console.log('- Average Confidence:', comparison.averageConfidence);
}

// ============================================
// 13. ANSWER VALIDATION
// ============================================

async function example_answerValidation() {
  console.log('\n=== EXAMPLE 12: Answer Validation ===\n');
  
  const validator = new AnswerValidator();
  
  const answers = [
    'Machine Learning is a subset of AI.',
    'This is a great answer because it provides detailed information about machine learning systems.',
    'ok'
  ];

  answers.forEach((answer, index) => {
    const validation = validator.validate(answer);
    console.log(`\nAnswer ${index + 1}: "${answer}"`);
    console.log('- Valid:', validation.isValid);
    console.log('- Score:', validation.score);
  });
}

// ============================================
// 14. KNOWLEDGE GRAPH USAGE
// ============================================

async function example_knowledgeGraph() {
  console.log('\n=== EXAMPLE 13: Knowledge Graph ===\n');
  
  const knowledgeGraph = new KnowledgeGraph();
  
  // Add nodes
  knowledgeGraph.addNode('ai', { name: 'Artificial Intelligence' });
  knowledgeGraph.addNode('ml', { name: 'Machine Learning' });
  knowledgeGraph.addNode('dl', { name: 'Deep Learning' });

  // Add edges
  knowledgeGraph.addEdge('ai', 'ml', 'is_parent_of');
  knowledgeGraph.addEdge('ml', 'dl', 'is_parent_of');

  // Query
  const path = knowledgeGraph.findPath('ai', 'dl');
  console.log('Path from AI to Deep Learning:', path);
}

// ============================================
// 15. COMPLETE WORKFLOW
// ============================================

async function example_completeWorkflow() {
  console.log('\n=== EXAMPLE 14: Complete Workflow ===\n');
  
  const userQuery = 'Tell me about machine learning and its applications';
  
  // Step 1: Optimize query
  const queryOptimizer = new QueryOptimizer();
  const optimizedQuery = queryOptimizer.optimize(userQuery);
  console.log('1. Original Query:', userQuery);
  console.log('2. Optimized Query:', optimizedQuery);

  // Step 2: Process complex query
  const processed = await queryProcessor.processQuery(optimizedQuery);
  console.log('3. Sub-questions found:', processed.subQuestions.length);

  // Step 3: Store in memory
  memorySystem.store(optimizedQuery, 'short-term');
  memorySystem.store(processed.synthesizedAnswer, 'long-term');
  console.log('4. Stored in memory system');

  // Step 4: Analyze text
  const analysis = await analytics.analyzeText(optimizedQuery);
  console.log('5. Sentiment:', analysis.sentiment.sentiment);
  console.log('6. Complexity:', analysis.complexity.level);

  // Step 5: Get statistics
  const stats = memorySystem.getStats();
  console.log('7. Memory Usage:', stats.totalSize, 'items');

  console.log('\n✓ Workflow completed successfully!');
}

// ============================================
// RUN EXAMPLES
// ============================================

async function runAllExamples() {
  try {
    await example_basicQuestion();
    await example_multipleQuestions();
    await example_complexQuery();
    await example_textAnalysis();
    await example_grammarValidation();
    await example_memorySystem();
    await example_contextAwareConversation();
    await example_queryOptimization();
    await example_batchProcessing();
    await example_conversationHistory();
    await example_compareAnswers();
    await example_answerValidation();
    await example_knowledgeGraph();
    await example_completeWorkflow();

    console.log('\n\n=====================================');
    console.log('   ALL EXAMPLES COMPLETED!');
    console.log('=====================================\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run examples
runAllExamples();
