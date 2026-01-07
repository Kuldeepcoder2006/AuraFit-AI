import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateChatBasedWorkout = async (userInput: string, profile: UserProfile) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user wants a workout plan with these requirements: "${userInput}". 
    User Context: ${profile.experienceLevel} ${profile.gender}, Goal: ${profile.goal}, Usual Type: ${profile.workoutType}. 
    Generate a JSON array of workout objects. Each object must follow the schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.NUMBER },
                  reps: { type: Type.STRING },
                  weight: { type: Type.NUMBER },
                },
                required: ["name", "sets", "reps"]
              }
            }
          },
          required: ["title", "duration", "calories", "exercises"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const generateWorkoutPlan = async (profile: UserProfile) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 1-day sample workout for a ${profile.experienceLevel} ${profile.gender} aiming for ${profile.goal} using ${profile.workoutType} equipment. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.NUMBER },
                reps: { type: Type.STRING },
                weight: { type: Type.NUMBER },
              },
              required: ["name", "sets", "reps"]
            }
          }
        },
        required: ["title", "duration", "calories", "exercises"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateDietPlan = async (
  profile: UserProfile, 
  customWeight: number,
  goalWeight: number,
  goalType: string, 
  veg: boolean, 
  availableIngredients: string
) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 1-day highly optimized, budget-friendly Indian diet plan.
    User Profile: ${profile.gender}.
    Current Weight: ${customWeight}kg. 
    Goal Weight: ${goalWeight}kg. 
    Goal Strategy: ${goalType} (Focus on high protein and high fiber if fat cut).
    Dietary Preference: ${veg ? 'Strictly Vegetarian (Indian style)' : 'Non-Vegetarian (Eggs/Chicken allowed)'}. 
    
    Ingredient Context: ${availableIngredients ? `User has these at home: ${availableIngredients}` : 'No ingredients specified. Use most affordable, nutrient-dense Indian staples like Moong Dal, Oats, Eggs, Paneer, Curd, seasonal vegetables, etc.'}.
    
    The plan must include:
    1. Calorie and macro-nutrient breakdown (Protein, Carbs, Fats in grams).
    2. Exactly 4 meals: Breakfast, Lunch, Snacks, Dinner.
    3. Detailed Indian dish names and complete recipes (step-by-step instructions).
    
    Return the result strictly as a JSON object matching the provided schema.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER }
            },
            required: ["protein", "carbs", "fats"]
          },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["Breakfast", "Lunch", "Snacks", "Dinner"] },
                dish: { type: Type.STRING },
                recipe: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "ingredients", "instructions"]
                }
              },
              required: ["type", "dish", "recipe"]
            }
          }
        },
        required: ["title", "calories", "macros", "meals"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getCoachAdvice = async (message: string, profile: UserProfile) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: `You are a world-class AI Fitness Coach named Aura. The user is ${profile.name}, a ${profile.experienceLevel} fitness enthusiast. Be encouraging, use 3D/modern language concepts, and provide scientifically accurate advice for ${profile.goal}.`,
    }
  });
  return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
};