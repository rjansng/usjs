let inapp_data = {
  "isGracePeriodExpired": false,
  "expire": "2088-08-08T08:08:08Z",
  "inAppPurchaseAllowed": true,
  "isExpired": false,
  "tier": {
    "id": "gold",
    "feature": [
      {
        "status": "Included",
        "id": "siri_search",
        "isFree": false,
        "rank": 1
      },
      {
        "status": "Included",
        "id": "no_ads",
        "isFree": false,
        "rank": 2
      },
      {
        "status": "Included",
        "id": "extended_spam_blocking",
        "isFree": false,
        "rank": 3
      },
      {
        "status": "Included",
        "id": "call_assistant",
        "isFree": false,
        "rank": 4
      },
      {
        "status": "Included",
        "id": "assistant_voicemail",
        "isFree": false,
        "rank": 5
      },
      {
        "status": "Included",
        "id": "assistant_custom_greeting",
        "isFree": false,
        "rank": 6
      },
      {
        "status": "Included",
        "id": "ct_call_recording",
        "isFree": false,
        "rank": 7
      },
      {
        "status": "Included",
        "id": "who_viewed_my_profile",
        "isFree": false,
        "rank": 9
      },
      {
        "status": "Included",
        "id": "incognito_mode",
        "isFree": false,
        "rank": 11
      },
      {
        "status": "Included",
        "id": "premium_badge",
        "isFree": false,
        "rank": 15
      },
      {
        "status": "Included",
        "id": "premium_support",
        "isFree": false,
        "rank": 16
      },
      {
        "status": "Included",
        "id": "live_chat_support",
        "isFree": false,
        "rank": 17
      },
      {
        "status": "Included",
        "id": "premium_app_icon",
        "isFree": false,
        "rank": 19
      },
      {
        "status": "Included",
        "id": "gold_caller_id",
        "isFree": false,
        "rank": 20
      }
    ],
},
  "start": "2023-08-08T08:08:08Z"
}

$done({ response: { status: 200, body: JSON.stringify(inapp_data) } });