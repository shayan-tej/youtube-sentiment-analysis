import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import pandas as pd
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# Configuration
MAX_COMMENTS = 100
YT_API_KEY = os.getenv('YT_API_KEY')

def clean_text(text):
    """Clean text for sentiment analysis"""
    if not text:
        return ""
    text = re.sub(r'[^\w\s]', ' ', text.lower())
    return ' '.join(text.split())

def analyze_sentiment(text):
    """Perform sentiment analysis using TextBlob"""
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    return {
        'polarity': round(polarity, 4),
        'subjectivity': round(analysis.sentiment.subjectivity, 4),
        'sentiment': 'positive' if polarity > 0.1 else 'negative' if polarity < -0.1 else 'neutral'
    }

def extract_video_id(url):
    """Extract video ID from URL with multiple fallbacks"""
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/v/)([\w-]{11})',
        r'(?:embed/|v/|watch\?v=)([\w-]{11})'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_video_details(video_id):
    """Get video details using web scraping fallback"""
    try:
        # Try with pytube first
        from pytube import YouTube
        yt = YouTube(f'https://youtube.com/watch?v={video_id}')
        return {
            'title': yt.title,
            'thumbnail': yt.thumbnail_url,
            'author': yt.author
        }
    except:
        # Fallback to web scraping
        try:
            url = f'https://www.youtube.com/watch?v={video_id}'
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            title = soup.find('meta', property='og:title')['content']
            thumbnail = soup.find('meta', property='og:image')['content']
            return {
                'title': title,
                'thumbnail': thumbnail,
                'author': 'Unknown'
            }
        except:
            return None

def get_comments(video_id, max_comments):
    """Get comments with multiple fallback methods"""
    comments = []
    
    # Method 1: YouTube API (if key available)
    if YT_API_KEY:
        try:
            from googleapiclient.discovery import build
            youtube = build('youtube', 'v3', developerKey=YT_API_KEY)
            
            results = youtube.commentThreads().list(
                part='snippet',
                videoId=video_id,
                maxResults=min(max_comments, 100),
                textFormat='plainText',
                order='relevance'
            ).execute()
            
            for item in results['items']:
                comment = item['snippet']['topLevelComment']['snippet']
                comments.append({
                    'text': comment['textDisplay'],
                    'author': comment['authorDisplayName'],
                    'likes': comment['likeCount'],
                    'published': comment['publishedAt']
                })
                if len(comments) >= max_comments:
                    break
            return comments
        except:
            pass
    
    # Method 2: Web scraping fallback
    try:
        url = f'https://www.youtube.com/watch?v={video_id}'
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find comment elements (this might change as YouTube updates)
        comment_elements = soup.select('yt-formatted-string#content-text')
        for element in comment_elements[:max_comments]:
            comments.append({
                'text': element.get_text(strip=True),
                'author': 'Unknown',
                'likes': 0,
                'published': ''
            })
        return comments
    except:
        return []

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Missing YouTube URL'}), 400
    
    url = data['url'].strip()
    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({'error': 'Invalid YouTube URL'}), 400
    
    max_comments = min(int(data.get('max_comments', MAX_COMMENTS)), 200)
    
    # Get video details
    video_details = get_video_details(video_id)
    if not video_details:
        return jsonify({'error': 'Could not fetch video details'}), 400
    
    # Get comments
    raw_comments = get_comments(video_id, max_comments)
    if not raw_comments:
        return jsonify({'error': 'No comments found or comments disabled'}), 404
    
    # Process comments
    processed_comments = []
    for comment in raw_comments:
        cleaned = clean_text(comment['text'])
        sentiment = analyze_sentiment(cleaned)
        processed_comments.append({
            **comment,
            'sentiment': sentiment['sentiment'],
            'polarity': sentiment['polarity'],
            'subjectivity': sentiment['subjectivity']
        })
    
    # Calculate statistics
    df = pd.DataFrame(processed_comments)
    stats = {
        'total': len(processed_comments),
        'positive': len(df[df['sentiment'] == 'positive']),
        'negative': len(df[df['sentiment'] == 'negative']),
        'neutral': len(df[df['sentiment'] == 'neutral']),
        'avg_polarity': round(df['polarity'].mean(), 4),
        'avg_subjectivity': round(df['subjectivity'].mean(), 4)
    }
    
    return jsonify({
        'video': {
            'id': video_id,
            'title': video_details['title'],
            'thumbnail': video_details['thumbnail'],
            'author': video_details['author']
        },
        'comments': processed_comments,
        'statistics': stats
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
