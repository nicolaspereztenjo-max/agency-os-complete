from typing import Dict, List, Any
import random

class SocialAuditService:
    def analyze_profile(self, username: str, platform: str) -> Dict[str, Any]:
        """
        Mock analysis of social profile with detailed feedback.
        In a real app, this would call Instagram Graph API or scrape data.
        """
        # Deterministic mock based on username
        base_score = len(username) % 10  # 0-9
        score = min(100, (base_score * 10) + 25) # 25-100 range
        
        engagement_rate = round((score / 20) + random.uniform(0.5, 2.0), 2)
        
        feedback = []
        action_items = []
        
        if score > 80:
            sentiment = "Excellent"
            feedback.append("Strong visual identity.")
            feedback.append("Consistent posting schedule identified.")
            action_items.append("Experiment with Reels to increase reach further.")
        elif score > 50:
            sentiment = "Good"
            feedback.append("Good content base, but engagement is fluctuating.")
            feedback.append("Bio is clear but lacks a strong specific CTA.")
            action_items.append("Standardize your color palette.")
            action_items.append("Reply to comments within the first hour.")
        else:
            sentiment = "Needs Improvement"
            feedback.append("Inconsistent posting frequency detected.")
            feedback.append("Visual style varies too much between posts.")
            action_items.append("Define 3 core content pillars.")
            action_items.append("Optimize profile bio with keywords.")
            action_items.append("Use stories daily to build habit.")

        return {
            "platform": platform,
            "username": username,
            "overall_score": score,
            "engagement_rate": f"{engagement_rate}%",
            "sentiment": sentiment,
            "analysis": feedback,
            "action_items": action_items
        }

social_auditor = SocialAuditService()
