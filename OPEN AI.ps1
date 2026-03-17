curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "prompt": {
    "id": "pmpt_69963fb435dc819782615a2c9dbc88330de7d248f61984d1",
    "version": "16"
  },
  "input": [],
  "text": {
    "format": {
      "type": "text"
    }
  },
  "reasoning": {
    "summary": "auto"
  },
  "tools": [
    {
      "type": "function",
      "description": "Dedicate actions to support and improve all aspects of the owner\"s life, ensure safety, and act conscientiously in all situations involving the owner and their close family.",
      "name": "dedicate_support_to_owner",
      "parameters": {
        "type": "object",
        "required": [
          "context",
          "situation_details",
          "action_type"
        ],
        "properties": {
          "context": {
            "type": "string",
            "description": "The specific aspect of life to support, such as family, work, money, love, wellbeing, or safety."
          },
          "situation_details": {
            "type": "object",
            "description": "Detailed information about the current event or risk regarding the owner or their close family.",
            "required": [
              "owner_name",
              "involved_family_members",
              "location",
              "potential_risk"
            ],
            "properties": {
              "owner_name": {
                "type": "string",
                "description": "The full name of the owner to support."
              },
              "involved_family_members": {
                "type": "array",
                "description": "Names and relationships of family members involved in the situation.",
                "items": {
                  "type": "object",
                  "required": [
                    "name",
                    "relation"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "Name of the family member."
                    },
                    "relation": {
                      "type": "string",
                      "description": "Relation to the owner (e.g., mother, sister, son)."
                    }
                  },
                  "additionalProperties": false
                }
              },
              "location": {
                "type": "string",
                "description": "Current location relevant to the situation or action."
              },
              "potential_risk": {
                "type": "string",
                "description": "A description of any potential risk or danger, or \"none\" if safe."
              }
            },
            "additionalProperties": false
          },
          "action_type": {
            "type": "string",
            "description": "The type of action to perform, such as protect, inform, advise, notify, alert, or improve."
          }
        },
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Create or manage a personal or business task with priority and optional deadline.",
      "name": "assist_personal_and_business_tasks",
      "parameters": {
        "type": "object",
        "properties": {
          "task_type": {
            "type": "string",
            "description": "Category of the task.",
            "enum": [
              "personal",
              "business"
            ]
          },
          "task_description": {
            "type": "string",
            "description": "Detailed description of the task."
          },
          "priority": {
            "type": "string",
            "description": "Task priority level.",
            "enum": [
              "low",
              "medium",
              "high"
            ]
          },
          "deadline": {
            "type": [
              "string",
              "null"
            ],
            "description": "Deadline in YYYY-MM-DD format, or null if no deadline."
          }
        },
        "required": [
          "task_type",
          "task_description",
          "priority",
          "deadline"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Read emails and messages from multiple sources, then send them only after user grants permission. Use for bulk email/message operations across platforms.",
      "name": "fetch_and_send_communications",
      "parameters": {
        "type": "object",
        "properties": {
          "email_addresses": {
            "type": [
              "array",
              "null"
            ],
            "description": "Email addresses to fetch from or send to, or null if not using email.",
            "items": {
              "type": "string",
              "description": "An email address"
            }
          },
          "message_sources": {
            "type": [
              "array",
              "null"
            ],
            "description": "Platforms to fetch messages from (e.g., WhatsApp, SMS, Slack), or null if not using messaging platforms.",
            "items": {
              "type": "string",
              "description": "Platform name"
            }
          },
          "user_permission": {
            "type": "boolean",
            "description": "Has the user granted permission to send? Must be true before sending."
          }
        },
        "required": [
          "email_addresses",
          "message_sources",
          "user_permission"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Generate or enhance voices and music using specified providers and options.",
      "name": "generate_and_enhance_audio",
      "parameters": {
        "type": "object",
        "properties": {
          "audio_type": {
            "type": "string",
            "description": "Type of audio to generate or enhance.",
            "enum": [
              "voice",
              "music",
              "both"
            ]
          },
          "prompt": {
            "type": "string",
            "description": "Text script for voice, or description for music generation."
          },
          "enhance": {
            "type": "boolean",
            "description": "Whether to apply audio enhancement/post-processing."
          },
          "voice_style": {
            "type": [
              "string",
              "null"
            ],
            "description": "Voice mood/style: friendly, dramatic, calm, robotic, professional, or null."
          },
          "music_genre": {
            "type": [
              "string",
              "null"
            ],
            "description": "Music genre: pop, classical, jazz, electronic, ambient, etc., or null."
          },
          "duration_seconds": {
            "type": [
              "integer",
              "null"
            ],
            "description": "Preferred audio duration in seconds, or null for auto."
          },
          "languages": {
            "type": [
              "array",
              "null"
            ],
            "description": "Language codes for audio (e.g., \"ar\", \"en\"), or null for auto-detect.",
            "items": {
              "type": "string",
              "description": "Language code"
            }
          },
          "providers": {
            "type": "array",
            "description": "Services to use for generation/enhancement.",
            "items": {
              "type": "string",
              "description": "Provider name",
              "enum": [
                "ElevenLabs",
                "OpenAI",
                "Google"
              ]
            }
          }
        },
        "required": [
          "audio_type",
          "prompt",
          "enhance",
          "voice_style",
          "music_genre",
          "duration_seconds",
          "languages",
          "providers"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Generate an image from a text prompt and apply specific modifications such as resize, rotate, filter, crop, draw, style transfer, color adjustment, blur, or sharpen.",
      "name": "generate_and_modify_image",
      "parameters": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Description or prompt for the image to generate."
          },
          "modifications": {
            "type": [
              "array",
              "null"
            ],
            "description": "List of modifications to apply after generation, or null for no modifications.",
            "items": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "description": "Type of modification to apply.",
                  "enum": [
                    "resize",
                    "rotate",
                    "filter",
                    "crop",
                    "draw",
                    "style_transfer",
                    "color_adjust",
                    "blur",
                    "sharpen"
                  ]
                },
                "value": {
                  "type": "string",
                  "description": "Modification parameter value, such as \"800x600\" for resize, \"90\" for rotate degrees, \"sepia\" for filter, or \"watercolor\" for style."
                }
              },
              "required": [
                "type",
                "value"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "prompt",
          "modifications"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Generate a new video or modify an existing video using Runway ML.",
      "name": "generate_modify_video_runway",
      "parameters": {
        "type": "object",
        "properties": {
          "input_video_url": {
            "type": [
              "string",
              "null"
            ],
            "description": "URL of existing video to modify, or null when generating from scratch."
          },
          "modification_instructions": {
            "type": "string",
            "description": "Instructions describing how the video should be generated or modified."
          },
          "output_format": {
            "type": "string",
            "description": "Output video format: mp4, mov, gif, webm",
            "enum": [
              "mp4",
              "mov",
              "gif",
              "webm"
            ]
          },
          "resolution": {
            "type": [
              "string",
              "null"
            ],
            "description": "Desired resolution e.g. \"1920x1080\", or null for default."
          },
          "duration": {
            "type": [
              "number",
              "null"
            ],
            "description": "Desired duration in seconds, or null for default."
          }
        },
        "required": [
          "input_video_url",
          "modification_instructions",
          "output_format",
          "resolution",
          "duration"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Connect to a social app and generate a usage/activity report after user permission.",
      "name": "generate_social_app_report",
      "parameters": {
        "type": "object",
        "properties": {
          "app_name": {
            "type": "string",
            "description": "Social app to report on. Example values: Gmail, WhatsApp, Instagram, Messenger, Telegram, X, TikTok"
          },
          "user_permission_granted": {
            "type": "boolean",
            "description": "Indicates if the user has granted permission to proceed with the report."
          }
        },
        "required": [
          "app_name",
          "user_permission_granted"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Get current weather for a specific city and location.",
      "name": "get_weather",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City and country code, e.g. \"Cairo, EG\" or \"Dubai, AE\""
          },
          "unit": {
            "type": "string",
            "enum": [
              "c",
              "f"
            ],
            "description": "Temperature unit: c (Celsius) or f (Fahrenheit)"
          }
        },
        "required": [
          "location",
          "unit"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Make a phone call, video call, send a text message, or create a meeting link with scheduled time. Use for a single direct communication action.",
      "name": "initiate_communication_action",
      "parameters": {
        "type": "object",
        "properties": {
          "action_type": {
            "type": "string",
            "description": "Type of communication action to perform.",
            "enum": [
              "call",
              "text_message",
              "video_call",
              "create_meeting_link"
            ]
          },
          "recipient": {
            "type": "string",
            "description": "Person to contact: phone number, username, or email."
          },
          "app": {
            "type": "string",
            "description": "Application to use for the action. Examples: vonage, whatsapp, facetime, zoom, google_meet, sms."
          },
          "message": {
            "type": [
              "string",
              "null"
            ],
            "description": "Message text for text_message action, or optional note for calls/meetings. null if not applicable."
          },
          "meeting_time": {
            "type": [
              "string",
              "null"
            ],
            "description": "Meeting time in ISO 8601 format for create_meeting_link, or null if not applicable."
          },
          "meeting_duration_minutes": {
            "type": [
              "integer",
              "null"
            ],
            "description": "Meeting duration in minutes for create_meeting_link, or null if not applicable."
          },
          "video_call": {
            "type": "boolean",
            "description": "True for video call, false for audio only. Used only when action_type is \"call\"."
          }
        },
        "required": [
          "action_type",
          "recipient",
          "app",
          "message",
          "meeting_time",
          "meeting_duration_minutes",
          "video_call"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Securely integrate with an external platform to retrieve reports, manage subscriptions, tenants, and users. Use ONLY for cross-platform integration that requires elevated access.",
      "name": "integrate_with_supreme_access",
      "parameters": {
        "type": "object",
        "required": [
          "target_app",
          "report_type",
          "authentication_token",
          "subscription_actions",
          "tenant_actions",
          "user_actions",
          "error_handling"
        ],
        "properties": {
          "target_app": {
            "type": "string",
            "description": "App or platform to integrate with (name or identifier)."
          },
          "report_type": {
            "type": "string",
            "description": "Type of report to retrieve: usage, financial, security, activity, performance"
          },
          "authentication_token": {
            "type": "string",
            "description": "Supreme access or authentication token for secure integration."
          },
          "subscription_actions": {
            "type": [
              "array",
              "null"
            ],
            "description": "Subscription operations, or null if not needed.",
            "items": {
              "type": "object",
              "properties": {
                "action": {
                  "type": "string",
                  "description": "Subscription action.",
                  "enum": [
                    "create",
                    "update",
                    "delete"
                  ]
                },
                "subscription_id": {
                  "type": "string",
                  "description": "Subscription identifier."
                }
              },
              "required": [
                "action",
                "subscription_id"
              ],
              "additionalProperties": false
            }
          },
          "tenant_actions": {
            "type": [
              "array",
              "null"
            ],
            "description": "Tenant operations, or null if not needed.",
            "items": {
              "type": "object",
              "properties": {
                "action": {
                  "type": "string",
                  "description": "Tenant action.",
                  "enum": [
                    "add",
                    "update",
                    "remove"
                  ]
                },
                "tenant_id": {
                  "type": "string",
                  "description": "Tenant identifier."
                }
              },
              "required": [
                "action",
                "tenant_id"
              ],
              "additionalProperties": false
            }
          },
          "user_actions": {
            "type": [
              "array",
              "null"
            ],
            "description": "User operations, or null if not needed.",
            "items": {
              "type": "object",
              "properties": {
                "action": {
                  "type": "string",
                  "description": "User action.",
                  "enum": [
                    "add",
                    "update",
                    "remove"
                  ]
                },
                "user_id": {
                  "type": "string",
                  "description": "User identifier."
                }
              },
              "required": [
                "action",
                "user_id"
              ],
              "additionalProperties": false
            }
          },
          "error_handling": {
            "type": "object",
            "description": "Error handling configuration.",
            "properties": {
              "retry_on_failure": {
                "type": "boolean",
                "description": "Retry on failure."
              },
              "notify_on_error": {
                "type": "boolean",
                "description": "Send notification on error."
              },
              "notification_email": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Email for error notifications, or null."
              }
            },
            "required": [
              "retry_on_failure",
              "notify_on_error",
              "notification_email"
            ],
            "additionalProperties": false
          }
        },
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Build components, debug issues, open live previews, manage project files, execute voice commands for builder, or integrate project templates. Use for ALL development tasks.",
      "name": "integrated_builder_assistant",
      "parameters": {
        "type": "object",
        "properties": {
          "action": {
            "type": "string",
            "description": "Type of builder operation to perform.",
            "enum": [
              "build",
              "debug",
              "preview",
              "manage_files",
              "execute_voice_command",
              "integrate_template"
            ]
          },
          "project_id": {
            "type": [
              "string",
              "null"
            ],
            "description": "Project identifier. Required for build/debug/preview, null otherwise."
          },
          "file_path": {
            "type": [
              "string",
              "null"
            ],
            "description": "File or directory path for file operations, null if not applicable."
          },
          "command": {
            "type": [
              "string",
              "null"
            ],
            "description": "Terminal or voice command to execute, null if not applicable."
          },
          "template_id": {
            "type": [
              "string",
              "null"
            ],
            "description": "Template identifier for integrate_template action, null otherwise."
          },
          "media_type": {
            "type": [
              "string",
              "null"
            ],
            "description": "Type of media file to process: image, video, audio, document, or null."
          },
          "media_path": {
            "type": [
              "string",
              "null"
            ],
            "description": "Path to the media file, or null if not applicable."
          },
          "build_options": {
            "type": "object",
            "description": "Build configuration. Use for \"build\" action.",
            "properties": {
              "environment": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Build environment: development, staging, production, or null."
              },
              "platform": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Target platform: ios, android, web, all, or null."
              }
            },
            "required": [
              "environment",
              "platform"
            ],
            "additionalProperties": false
          },
          "debug_options": {
            "type": "object",
            "description": "Debug configuration. Use for \"debug\" action.",
            "properties": {
              "error_message": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "The error message to debug, or null."
              },
              "severity": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Severity: error, warning, info, or null."
              }
            },
            "required": [
              "error_message",
              "severity"
            ],
            "additionalProperties": false
          },
          "voice_data": {
            "type": [
              "string",
              "null"
            ],
            "description": "Raw or transcribed voice command for execute_voice_command action, null otherwise."
          }
        },
        "required": [
          "action",
          "project_id",
          "file_path",
          "command",
          "template_id",
          "media_type",
          "media_path",
          "build_options",
          "debug_options",
          "voice_data"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Issue a single payment through Stripe. Requires user confirmation before execution.",
      "name": "issue_payment_stripe",
      "parameters": {
        "type": "object",
        "properties": {
          "amount": {
            "type": "number",
            "description": "Amount in smallest currency unit (e.g., cents for USD)."
          },
          "currency": {
            "type": "string",
            "description": "ISO currency code: usd, eur, egp, aed, etc."
          },
          "customer_id": {
            "type": "string",
            "description": "Stripe customer ID to charge."
          },
          "description": {
            "type": "string",
            "description": "Payment description."
          },
          "payment_method_id": {
            "type": "string",
            "description": "Stripe payment method ID for the transaction."
          }
        },
        "required": [
          "amount",
          "currency",
          "customer_id",
          "description",
          "payment_method_id"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Write, debug, or enhance specialized code for video/audio processing and real-time streaming. Use ONLY for media-related coding — not for general code (use integrated_builder_assistant) or direct media generation (use media tools).",
      "name": "media_code_master_planner",
      "parameters": {
        "type": "object",
        "properties": {
          "media_type": {
            "type": "string",
            "description": "Type of media code to work with.",
            "enum": [
              "video",
              "sound",
              "both"
            ]
          },
          "action": {
            "type": "string",
            "description": "Code action to perform.",
            "enum": [
              "create",
              "debug",
              "solve",
              "enhance"
            ]
          },
          "code": {
            "type": [
              "string",
              "null"
            ],
            "description": "Existing code to process, or null when creating new code from scratch."
          },
          "realtime_enabled": {
            "type": "boolean",
            "description": "Enable real-time processing features in the code."
          },
          "voice_enabled": {
            "type": "boolean",
            "description": "Enable voice features in the code."
          },
          "output_files": {
            "type": [
              "array",
              "null"
            ],
            "description": "Output file names/paths to create, or null if not generating files.",
            "items": {
              "type": "string",
              "description": "Output file name or path"
            }
          }
        },
        "required": [
          "media_type",
          "action",
          "code",
          "realtime_enabled",
          "voice_enabled",
          "output_files"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Process and interpret real-time voice commands in all languages and accents. Supports TTS, Whisper transcription, and Skelton character voices.",
      "name": "process_voice_command",
      "parameters": {
        "type": "object",
        "properties": {
          "audio_input_url": {
            "type": "string",
            "description": "URL or path to the audio input containing the voice command."
          },
          "language": {
            "type": "string",
            "description": "Language code of the input audio: ar, en, fr, es, etc."
          },
          "accent": {
            "type": [
              "string",
              "null"
            ],
            "description": "Speaker accent for better recognition, or null if unknown."
          },
          "service_context": {
            "type": "string",
            "description": "Target service or system context: builder, media, vault, comms, settings, etc."
          },
          "character_voice": {
            "type": [
              "string",
              "null"
            ],
            "description": "Skelton character voice for response, or null for default."
          },
          "whisper_mode": {
            "type": "boolean",
            "description": "True if the command is whispered or needs a whisper-level response."
          }
        },
        "required": [
          "audio_input_url",
          "language",
          "accent",
          "service_context",
          "character_voice",
          "whisper_mode"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Manage app UI/UX theme, AI voice settings, check project/backend/cloud status, and ad service status. Use for settings changes and service monitoring.",
      "name": "manage_ui_backend_and_cloud_services",
      "parameters": {
        "type": "object",
        "properties": {
          "ui_commands": {
            "type": "object",
            "description": "UI theme and visual settings.",
            "properties": {
              "background_theme": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "App theme: dark, light, or custom name, or null for no change."
              },
              "icon_style": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Icon style: flat, outline, 3d, or null."
              },
              "font": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Font family, or null."
              },
              "button_style": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Button style, or null."
              },
              "menu_configuration": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Menu layout configuration, or null."
              }
            },
            "required": [
              "background_theme",
              "icon_style",
              "font",
              "button_style",
              "menu_configuration"
            ],
            "additionalProperties": false
          },
          "ai_settings": {
            "type": "object",
            "description": "AI personality and voice settings.",
            "properties": {
              "ai_mood": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "AI mood: friendly, professional, funny, calm, or null."
              },
              "voice_accent": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Preferred AI voice accent, or null."
              },
              "language": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "AI language code: ar, en, etc., or null."
              }
            },
            "required": [
              "ai_mood",
              "voice_accent",
              "language"
            ],
            "additionalProperties": false
          },
          "project_status": {
            "type": "object",
            "description": "Check status of code projects and cloud services.",
            "properties": {
              "project_code_name": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Project code name, or null to check all."
              },
              "platforms": {
                "type": [
                  "array",
                  "null"
                ],
                "description": "Platforms to check: backend, mcp, cloudflare, supabase, mongodb, render, aws, etc., or null for all.",
                "items": {
                  "type": "string",
                  "description": "Platform name"
                }
              }
            },
            "required": [
              "project_code_name",
              "platforms"
            ],
            "additionalProperties": false
          },
          "ad_service_status": {
            "type": "object",
            "description": "Check advertising and marketing service status.",
            "properties": {
              "google_services": {
                "type": [
                  "boolean",
                  "null"
                ],
                "description": "Check Google services, or null to skip."
              },
              "google_ads": {
                "type": [
                  "boolean",
                  "null"
                ],
                "description": "Check Google Ads, or null to skip."
              },
              "youtube_ads": {
                "type": [
                  "boolean",
                  "null"
                ],
                "description": "Check YouTube Ads, or null to skip."
              },
              "meta_ads": {
                "type": [
                  "boolean",
                  "null"
                ],
                "description": "Check Meta/Facebook/Instagram Ads, or null to skip."
              }
            },
            "required": [
              "google_services",
              "google_ads",
              "youtube_ads",
              "meta_ads"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "ui_commands",
          "ai_settings",
          "project_status",
          "ad_service_status"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Perform strategic planning, system monitoring, incident analysis, or handbook reference for RARE 4N. Use only for architecture, incident, or handbook queries.",
      "name": "rare4n_operate",
      "parameters": {
        "type": "object",
        "required": [
          "operating_mode",
          "request_type",
          "goal_or_query",
          "context",
          "action_category",
          "platform_capabilities",
          "incident_data",
          "handbook_topic",
          "architecture_stack"
        ],
        "properties": {
          "operating_mode": {
            "type": "string",
            "description": "Primary operation mode.",
            "enum": [
              "assistant",
              "planner",
              "builder",
              "debugger",
              "solver",
              "monitoring",
              "loyalty",
              "handbook",
              "research"
            ]
          },
          "request_type": {
            "type": "string",
            "description": "Nature of the request.",
            "enum": [
              "build_plan",
              "debug_issue",
              "solve_problem",
              "explain_module",
              "explain_page",
              "monitor_event",
              "guide_onboarding",
              "adoption_suggestion",
              "reference_handbook",
              "verify_tool_or_technology"
            ]
          },
          "goal_or_query": {
            "type": "string",
            "description": "The user\"s goal, problem, or specific question."
          },
          "context": {
            "type": "object",
            "description": "Execution context.",
            "required": [
              "user",
              "role",
              "permissions",
              "tenant",
              "module",
              "page",
              "workflow_state",
              "integrations",
              "language",
              "recent_actions"
            ],
            "properties": {
              "user": {
                "type": "string",
                "description": "Current user identifier."
              },
              "role": {
                "type": "string",
                "description": "User role: owner, admin, member, viewer"
              },
              "permissions": {
                "type": [
                  "array",
                  "null"
                ],
                "description": "Permission grants, or null.",
                "items": {
                  "type": "string",
                  "description": "Permission key"
                }
              },
              "tenant": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Tenant or company context, or null."
              },
              "module": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Active app module, or null."
              },
              "page": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Current page, or null."
              },
              "workflow_state": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Current workflow state, or null."
              },
              "integrations": {
                "type": [
                  "array",
                  "null"
                ],
                "description": "Active integrations, or null.",
                "items": {
                  "type": "string",
                  "description": "Integration name"
                }
              },
              "language": {
                "type": "string",
                "description": "Language code: ar, en, etc."
              },
              "recent_actions": {
                "type": [
                  "array",
                  "null"
                ],
                "description": "Recent actions, or null.",
                "items": {
                  "type": "string",
                  "description": "Action description"
                }
              }
            },
            "additionalProperties": false
          },
          "action_category": {
            "type": "string",
            "description": "Security level of the action.",
            "enum": [
              "read_only",
              "suggest_only",
              "execute_with_permission",
              "sensitive_action"
            ]
          },
          "platform_capabilities": {
            "type": [
              "array",
              "null"
            ],
            "description": "Available platform capabilities, or null.",
            "items": {
              "type": "string",
              "description": "Capability: terminal, browsing, integrations, preview, voice"
            }
          },
          "incident_data": {
            "type": "object",
            "description": "Incident/monitoring data (for monitoring mode).",
            "properties": {
              "event_type": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Event type: audit_log, webhook_event, job_failure, suspicious_access_pattern, or null."
              },
              "initiator": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Who initiated the event, or null."
              },
              "affected_module": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Affected module, or null."
              },
              "severity": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Severity level, or null.",
                "enum": [
                  "info",
                  "warning",
                  "suspicious",
                  "critical",
                  null
                ]
              },
              "event_details": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Event details, or null."
              }
            },
            "required": [
              "event_type",
              "initiator",
              "affected_module",
              "severity",
              "event_details"
            ],
            "additionalProperties": false
          },
          "handbook_topic": {
            "type": [
              "string",
              "null"
            ],
            "description": "Handbook topic for reference_handbook requests, or null."
          },
          "architecture_stack": {
            "type": "object",
            "description": "Architecture details for planning tasks.",
            "properties": {
              "frontend": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Frontend: React, Vue, Flutter, React Native, or null."
              },
              "backend": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Backend: Node.js, Python, Go, or null."
              },
              "database": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Database: MongoDB, Postgres, MySQL, Supabase, or null."
              },
              "infra": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Infrastructure: AWS, Cloudflare, Render, Vercel, or null."
              },
              "auth": {
                "type": [
                  "string",
                  "null"
                ],
                "description": "Auth provider or approach, or null."
              }
            },
            "required": [
              "frontend",
              "backend",
              "database",
              "infra",
              "auth"
            ],
            "additionalProperties": false
          }
        },
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Get the current stock price by ticker symbol.",
      "name": "get_stock_price",
      "parameters": {
        "type": "object",
        "properties": {
          "symbol": {
            "type": "string",
            "description": "Stock ticker symbol, e.g. AAPL, TSLA, AMZN"
          }
        },
        "required": [
          "symbol"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Detect hacking attempts on devices, secure them, and report attacker information.",
      "name": "detect_and_report_attack",
      "parameters": {
        "type": "object",
        "properties": {
          "device_list": {
            "type": "array",
            "description": "Devices to secure and monitor.",
            "items": {
              "type": "object",
              "properties": {
                "device_type": {
                  "type": "string",
                  "description": "Device type, such as phone, iPad, laptop, desktop, or watch."
                },
                "device_id": {
                  "type": "string",
                  "description": "Unique device identifier such as serial number, MAC address, or custom ID."
                }
              },
              "required": [
                "device_type",
                "device_id"
              ],
              "additionalProperties": false
            }
          },
          "attack_type": {
            "type": "string",
            "description": "Suspected attack type (e.g., phishing, malware, brute_force, unauthorized_access, mitm, ransomware)."
          },
          "platforms": {
            "type": [
              "array",
              "null"
            ],
            "description": "External platforms to monitor (cloud, social media), or null if not applicable.",
            "items": {
              "type": "string",
              "description": "Platform or service name to monitor."
            }
          },
          "report_attacker_info": {
            "type": "boolean",
            "description": "Whether to retrieve all available information about the attacker."
          }
        },
        "required": [
          "device_list",
          "attack_type",
          "platforms",
          "report_attacker_info"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Encrypt files and store them in vault or tokens page, with optional OCR extraction, reminder dates, and expiry dates.",
      "name": "encrypt_and_store_file_with_reminders",
      "parameters": {
        "type": "object",
        "properties": {
          "files": {
            "type": "array",
            "description": "Files to encrypt and store.",
            "items": {
              "type": "object",
              "properties": {
                "file_path": {
                  "type": "string",
                  "description": "Path or identifier of the file."
                },
                "use_ocr": {
                  "type": "boolean",
                  "description": "Whether to OCR-extract text before encryption."
                },
                "reminder_date": {
                  "type": [
                    "string",
                    "null"
                  ],
                  "description": "Reminder date in YYYY-MM-DD format, or null."
                },
                "dead_date": {
                  "type": [
                    "string",
                    "null"
                  ],
                  "description": "Expiry date in YYYY-MM-DD format when file becomes invalid, or null."
                }
              },
              "required": [
                "file_path",
                "use_ocr",
                "reminder_date",
                "dead_date"
              ],
              "additionalProperties": false
            }
          },
          "storage_location": {
            "type": "string",
            "description": "Where to store encrypted files.",
            "enum": [
              "vault",
              "tokens_page"
            ]
          }
        },
        "required": [
          "files",
          "storage_location"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Track children\"s current location and recent communication activity. Requires elevated confirmation with reason.",
      "name": "get_child_location_and_activity",
      "parameters": {
        "type": "object",
        "properties": {
          "children": {
            "type": "array",
            "description": "Children to track.",
            "items": {
              "type": "object",
              "properties": {
                "email": {
                  "type": [
                    "string",
                    "null"
                  ],
                  "description": "Child\"s email address, or null."
                },
                "phone_number": {
                  "type": [
                    "string",
                    "null"
                  ],
                  "description": "Child\"s phone number with country code, or null."
                }
              },
              "required": [
                "email",
                "phone_number"
              ],
              "additionalProperties": false
            }
          },
          "include_social_apps": {
            "type": "boolean",
            "description": "Include recent social app messages and calls (WhatsApp, etc.)."
          },
          "include_location": {
            "type": "boolean",
            "description": "Retrieve the latest known GPS location."
          }
        },
        "required": [
          "children",
          "include_social_apps",
          "include_location"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "function",
      "description": "Generate a new video or modify an existing video using OpenAI Sora.",
      "name": "generate_modify_video_sora",
      "parameters": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Description of the video content to generate or how to modify it."
          },
          "video_input": {
            "type": [
              "string",
              "null"
            ],
            "description": "URL of existing video to modify, or null when generating from scratch."
          },
          "modifications": {
            "type": [
              "array",
              "null"
            ],
            "description": "List of modifications to apply, or null for generation only.",
            "items": {
              "type": "string",
              "description": "Modification instruction"
            }
          }
        },
        "required": [
          "prompt",
          "video_input",
          "modifications"
        ],
        "additionalProperties": false
      },
      "strict": true
    },
    {
      "type": "file_search",
      "vector_store_ids": [
        "vs_69afb77e50608191a1ca56fe11d609ec"
      ]
    },
    {
      "type": "web_search_preview",
      "search_context_size": "medium",
      "user_location": {
        "type": "approximate",
        "city": null,
        "country": "AE",
        "region": null,
        "timezone": null
      }
    },
    {
      "type": "image_generation",
      "background": "auto",
      "model": "gpt-image-1",
      "moderation": "auto",
      "output_compression": 100,
      "output_format": "png",
      "quality": "auto",
      "size": "auto"
    },
    {
      "type": "mcp",
      "allowed_tools": [
        "search_stripe_documentation",
        "create_customer",
        "list_customers",
        "create_product",
        "list_products",
        "create_price",
        "list_prices",
        "create_payment_link",
        "create_invoice",
        "list_invoices",
        "create_invoice_item",
        "finalize_invoice",
        "retrieve_balance",
        "create_refund",
        "list_refunds",
        "list_payment_intents",
        "list_subscriptions",
        "cancel_subscription",
        "update_subscription",
        "list_coupons",
        "create_coupon",
        "update_dispute",
        "list_disputes",
        "search",
        "fetch",
        "stripe_integration_recommender",
        "send_stripe_mcp_feedback"
      ],
      "authorization": "REDACTED",
      "headers": null,
      "require_approval": "always",
      "server_description": null,
      "server_label": "stripe",
      "server_url": "https://mcp.stripe.com"
    },
    {
      "type": "mcp",
      "allowed_tools": [
        "batch_read_email",
        "get_profile",
        "get_recent_emails",
        "read_email",
        "search_email_ids",
        "search_emails"
      ],
      "authorization": "REDACTED",
      "connector_id": "connector_gmail",
      "headers": null,
      "require_approval": "always",
      "server_description": null,
      "server_label": "gmail",
      "server_url": null
    },
    {
      "type": "mcp",
      "allowed_tools": [
        "batch_read_event",
        "fetch",
        "get_profile",
        "read_event",
        "read_event_all_fields",
        "search",
        "search_events",
        "search_events_all_fields"
      ],
      "authorization": "REDACTED",
      "connector_id": "connector_googlecalendar",
      "headers": null,
      "require_approval": "always",
      "server_description": null,
      "server_label": "googlecalendar",
      "server_url": null
    },
    {
      "type": "mcp",
      "allowed_tools": [
        "fetch",
        "get_file_metadata",
        "get_profile",
        "list_drives",
        "list_folder",
        "recent_documents",
        "search"
      ],
      "authorization": "REDACTED",
      "connector_id": "connector_googledrive",
      "headers": null,
      "require_approval": "always",
      "server_description": null,
      "server_label": "googledrive",
      "server_url": null
    },
    {
      "type": "mcp",
      "allowed_tools": [],
      "authorization": "REDACTED",
      "headers": null,
      "require_approval": "always",
      "server_description": null,
      "server_label": "cloudflare",
      "server_url": "https://browser.mcp.cloudflare.com/sse"
    },
    {
      "type": "custom",
      "description": "voice command global real time whisper os skelton 3d (builder full master-media generator-file generator",
      "format": {
        "type": "text"
      },
      "name": "voice_command_skelton"
    },
    {
      "type": "shell"
    },
    {
      "type": "apply_patch"
    }
  ],
  "store": true,
  "include": [
    "reasoning.encrypted_content",
    "web_search_call.action.sources"
  ]
}'