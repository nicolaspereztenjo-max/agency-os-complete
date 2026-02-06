from typing import Dict, Any, List
import random

class MetaAnalyticsService:
    def connect_account(self) -> Dict[str, str]:
        """
        Simulates the OAuth connection process.
        Returns a mock token and account ID.
        """
        return {
            "status": "connected",
            "account_id": "act_" + str(random.randint(100000, 999999)),
            "account_name": "Agency Client Ad Account",
            "access_token": "mock_token_" + "".join(random.choices("abcdef0123456789", k=16))
        }

    def get_account_stats(self, account_id: str) -> Dict[str, Any]:
        """
        Returns rich mock analytics for the last 30 days.
        """
        # Realistic agency metrics
        names = ["Global Ventures Ads", "E-com Scale Account", "Niche Market Lead Gen", "Brand Performance Main"]
        account_name = random.choice(names)
        
        impressions = random.randint(80000, 450000)
        cpm = random.uniform(3.0, 12.0)
        spend = round((impressions / 1000) * cpm, 2)
        clicks = int(impressions * random.uniform(0.012, 0.035))
        ctr = round((clicks / impressions) * 100, 2)
        
        # Audience Demographics
        demographics = {
            "age_18_24": random.randint(10, 20),
            "age_25_34": random.randint(30, 50),
            "age_35_44": random.randint(15, 30),
            "age_45_plus": random.randint(5, 15),
            "top_cities": random.sample(["New York", "London", "Toronto", "Sydney", "Berlin", "Tokyo", "Madrid"], 4)
        }

        # AI Positioning Strategy based on the data
        positioning = self._generate_positioning(ctr, spend)

        return {
            "account_id": account_id,
            "account_name": account_name,
            "period": "Last 30 Days",
            "spend": f"${spend:,.2f}",
            "impressions": f"{impressions:,}",
            "clicks": f"{clicks:,}",
            "ctr": f"{ctr}%",
            "demographics": demographics,
            "ai_positioning": positioning
        }


    def _generate_positioning(self, ctr: float, spend: float) -> Dict[str, str]:
        """
        Generates strategic advice based on performance metrics.
        """
        strategy = ""
        focus = ""

        if ctr > 1.5:
            strategy = "Your creative hooks are resonating highly. Double down on this visual style but increase budget to scale reach."
            focus = "Scale & Retargeting"
        elif ctr < 0.9:
            strategy = "Click-through rate is below benchmark. Your visuals might be blending in. Needs higher contrast and stronger hooks."
            focus = "Creative Testing"
        else:
            strategy = "Performance is stable. Start testing new audience lookalikes to expand beyond current saturation."
            focus = "Audience Expansion"
            
        return {
            "strategy": strategy,
            "focus_area": focus,
            "next_step": "Launch 3 new variations of the top performing ad."
        }

meta_analytics = MetaAnalyticsService()
