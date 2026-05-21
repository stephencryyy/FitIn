import * as admin from 'firebase-admin';

admin.initializeApp();

export { assistantChat } from './assistant/chat';
export { searchFood } from './nutrition/foodSearch';
export { onUserCreate } from './triggers/onUserCreate';
export { onWorkoutComplete } from './triggers/onWorkoutComplete';
