# NDIZIAI Mermaid Diagrams Pack

This file contains ready-to-use Mermaid diagram code blocks for project documentation.

## 1. System Context Diagram

```mermaid
flowchart LR
    User[User / Farmer / Processor] -->|Uploads banana image| Frontend[Frontend Web Client]
    Frontend -->|POST /api/classify/ image| API[Classification API - Django]
    API -->|Inference request| YOLO[YOLO Model best.pt]
    YOLO -->|Top class + probabilities| API
    API -->|JSON results| Frontend
    Frontend -->|GET /db/value-addition/?ripeness_stage=class| DBAPI[Value-Addition API - Django]
    DBAPI -->|Query by ripeness stage| SQLite[(SQLite Database)]
    SQLite -->|Methods + nested details| DBAPI
    DBAPI -->|JSON recommendations| Frontend
    Frontend -->|Displays prediction + recommendations| User
```

## 2. High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph ClientLayer[Client Layer]
        FE[HTML / CSS / JavaScript Frontend]
    end

    subgraph AppLayer[Django Application Layer]
        URLS[Root URL Router ndiziai/urls.py]
        APIAPP[api app]
        DBAPP[db app]
        DOCS[Swagger / ReDoc drf-yasg]
    end

    subgraph ServiceLayer[Service Layer]
        CLS[Banana Classification Service]
        REC[Recommendation Retrieval Service]
    end

    subgraph DataAndModel[Data and Model Layer]
        MODEL[Ultralytics YOLO best.pt]
        SQLITE[(SQLite db.sqlite3)]
    end

    FE --> URLS
    URLS --> APIAPP
    URLS --> DBAPP
    URLS --> DOCS

    APIAPP --> CLS
    DBAPP --> REC

    CLS --> MODEL
    REC --> SQLITE
```

## 3. Component Diagram (Backend)

```mermaid
flowchart LR
    subgraph DjangoProject[ndiziai Django Project]
        RootURLs[ndiziai/urls.py]
        Settings[ndiziai/settings.py]
    end

    subgraph APIApp[api app]
        APIURLs[api/urls.py]
        APIViews[api/views.py classify_banana]
    end

    subgraph DBApp[db app]
        DBURLs[db/urls.py]
        DBViews[db/views.py value_addition_list]
        Serializers[db/serializers.py]
        Models[db/models.py]
    end

    RootURLs --> APIURLs
    RootURLs --> DBURLs
    APIURLs --> APIViews
    DBURLs --> DBViews
    DBViews --> Serializers
    Serializers --> Models
    APIViews --> ModelFile[best.pt YOLO weights]
    DBViews --> SQLite[(db.sqlite3)]
```

## 4. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    actor U as User
    participant F as Frontend
    participant A as /api/classify/
    participant M as YOLO best.pt
    participant D as /db/value-addition/
    participant S as SQLite

    U->>F: Select image and click Classify
    F->>A: POST multipart/form-data (image)
    A->>A: Save temp image to /tmp
    A->>M: Run inference on image
    M-->>A: class probabilities
    A->>A: Build top_prediction + all_predictions
    A-->>F: JSON classification result

    F->>D: GET with ripeness_stage=predicted_class
    D->>S: Filter ValueAdditionMethod by stage
    S-->>D: Methods + related records
    D-->>F: JSON recommendations
    F-->>U: Render prediction and methods
```

## 5. Classification Flowchart

```mermaid
flowchart TD
    Start([Start]) --> CheckMethod{Request method is POST?}
    CheckMethod -- No --> Invalid1[Return 400 Invalid request] --> End([End])
    CheckMethod -- Yes --> CheckImage{image in request.FILES?}
    CheckImage -- No --> Invalid2[Return 400 Invalid request] --> End
    CheckImage -- Yes --> SaveTemp[Save uploaded image to /tmp UUID.jpg]
    SaveTemp --> Infer[Run YOLO inference using best.pt]
    Infer --> HasProbs{result.probs exists?}
    HasProbs -- No --> NoClass[Append No classification result]
    HasProbs -- Yes --> BuildPred[Build predictions map and sort]
    BuildPred --> PickTop[Pick top class and confidence]
    PickTop --> Append[Append to output results]
    NoClass --> Cleanup[Delete temp file]
    Append --> Cleanup
    Cleanup --> Response[Return JSON results]
    Response --> End
```

## 6. Recommendation Retrieval Flowchart

```mermaid
flowchart TD
    Start([Start]) --> GetStage[Read ripeness_stage query param]
    GetStage --> HasStage{ripeness_stage provided?}
    HasStage -- No --> Err400[Return 400 Ripeness stage is required] --> End([End])
    HasStage -- Yes --> Query[Query ValueAdditionMethod where ripeness_stage__iexact]
    Query --> Exists{Any records found?}
    Exists -- No --> Err404[Return 404 No records found]
    Exists -- Yes --> Serialize[Serialize records with nested related data]
    Serialize --> Ok200[Return 200 JSON results]
    Err404 --> End
    Ok200 --> End
```

## 7. Data Flow Diagram (DFD Level 0)

```mermaid
flowchart LR
    User[User] -->|Image file| P1((P1 Classify Banana))
    P1 -->|Predicted class + scores| User
    P1 -->|Predicted ripeness stage| P2((P2 Retrieve Value-Addition))
    P2 -->|Query| D1[(D1 Value-Addition Data Store SQLite)]
    D1 -->|Method records| P2
    P2 -->|Recommendations| User
```

## 8. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    VALUE_ADDITION_METHOD ||--o{ METHOD_INGREDIENT : has
    INGREDIENT ||--o{ METHOD_INGREDIENT : used_in

    VALUE_ADDITION_METHOD ||--o{ METHOD_SELLING_PLACE : has
    SELLING_PLACE ||--o{ METHOD_SELLING_PLACE : listed_in

    VALUE_ADDITION_METHOD ||--o{ STORAGE_TIP : has
    VALUE_ADDITION_METHOD ||--o{ MARKET_TREND : has

    VALUE_ADDITION_METHOD {
        int id PK
        string name
        text description
        text guide
        string youtube_link
        string time_required
        text equipment_needed
        string category
        string ripeness_stage
    }

    INGREDIENT {
        int id PK
        string name
    }

    METHOD_INGREDIENT {
        int id PK
        int method_id FK
        int ingredient_id FK
        string quantity
    }

    SELLING_PLACE {
        int id PK
        string name
        text location_details
    }

    METHOD_SELLING_PLACE {
        int id PK
        int method_id FK
        int selling_place_id FK
    }

    STORAGE_TIP {
        int id PK
        int method_id FK
        text tips
    }

    MARKET_TREND {
        int id PK
        int method_id FK
        text trend_analysis
    }
```

## 9. Class Diagram (Code-Oriented)

```mermaid
classDiagram
    class ValueAdditionMethod {
        +name: CharField
        +description: TextField
        +guide: TextField
        +youtube_link: URLField
        +time_required: CharField
        +equipment_needed: TextField
        +category: CharField
        +ripeness_stage: CharField
    }

    class Ingredient {
        +name: CharField
    }

    class MethodIngredient {
        +method: ForeignKey
        +ingredient: ForeignKey
        +quantity: CharField
    }

    class SellingPlace {
        +name: CharField
        +location_details: TextField
    }

    class MethodSellingPlace {
        +method: ForeignKey
        +selling_place: ForeignKey
    }

    class StorageTip {
        +method: ForeignKey
        +tips: TextField
    }

    class MarketTrend {
        +method: ForeignKey
        +trend_analysis: TextField
    }

    ValueAdditionMethod "1" --> "many" MethodIngredient
    Ingredient "1" --> "many" MethodIngredient
    ValueAdditionMethod "1" --> "many" MethodSellingPlace
    SellingPlace "1" --> "many" MethodSellingPlace
    ValueAdditionMethod "1" --> "many" StorageTip
    ValueAdditionMethod "1" --> "many" MarketTrend
```

## 10. Use Case Diagram

```mermaid
flowchart LR
    Actor[User]

    UC1((Upload banana image))
    UC2((Classify banana ripeness))
    UC3((View confidence scores))
    UC4((Get value-addition methods))
    UC5((View method details))
    UC6((Open API docs))

    Actor --> UC1
    Actor --> UC2
    Actor --> UC3
    Actor --> UC4
    Actor --> UC5
    Actor --> UC6

    UC1 --> UC2
    UC2 --> UC3
    UC2 --> UC4
    UC4 --> UC5
```

## 11. Deployment Diagram (Development)

```mermaid
flowchart TB
    subgraph UserMachine[Local Machine]
        Browser[Web Browser]
        FrontendFile[frontend/index.html]
    end

    subgraph DjangoRuntime[Django Dev Server 127.0.0.1:8000]
        APIEndpoint[/api/classify/]
        DBEndpoint[/db/value-addition/]
        DocEndpoints[/swagger/ + /redoc/]
        YOLOModel[best.pt loaded in memory]
        SQLiteDB[(db.sqlite3)]
    end

    Browser --> FrontendFile
    FrontendFile --> APIEndpoint
    FrontendFile --> DBEndpoint
    Browser --> DocEndpoints

    APIEndpoint --> YOLOModel
    DBEndpoint --> SQLiteDB
```

## 12. State Diagram (Ripeness Output States)

```mermaid
stateDiagram-v2
    [*] --> ImageSubmitted
    ImageSubmitted --> InferenceRunning
    InferenceRunning --> Unripe : top_prediction.class = unripe
    InferenceRunning --> Ripe : top_prediction.class = ripe
    InferenceRunning --> Overripe : top_prediction.class = overripe
    InferenceRunning --> Rotten : top_prediction.class = rotten

    Unripe --> RecommendationFetched
    Ripe --> RecommendationFetched
    Overripe --> RecommendationFetched
    Rotten --> RecommendationFetched

    RecommendationFetched --> [*]
```

## 13. API Decision Tree (Error Handling)

```mermaid
flowchart TD
    A[Incoming Request] --> B{Endpoint?}
    B -->|/api/classify/| C{POST and image present?}
    B -->|/db/value-addition/| D{ripeness_stage present?}

    C -->|No| E[400 Invalid request]
    C -->|Yes| F[200 results OR message No classification result]

    D -->|No| G[400 Ripeness stage is required]
    D -->|Yes| H{Records found?}
    H -->|No| I[404 No records found]
    H -->|Yes| J[200 results]
```

## 14. Documentation Tip

You can copy any block into Markdown docs. For Word:
1. Keep the code block as-is in a fenced block for source appendix.
2. Render diagrams in any Mermaid-compatible tool and export PNG/SVG for the main report.
