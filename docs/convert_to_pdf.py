#!/usr/bin/env python3
"""
Convert FINAL_REPORT_KR.md to PDF using WeasyPrint
Handles Korean fonts properly
"""

import os
import sys
from pathlib import Path
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

def convert_md_to_pdf(md_file: str, output_pdf: str):
    """Convert Markdown to PDF with Korean font support"""
    
    # Read markdown content
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML (basic conversion)
    # For better formatting, we'll use a simple HTML template
    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seoul Accessible Transit - 최종 보고서</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
            
            body {{
                font-family: 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
                line-height: 1.8;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                font-size: 11pt;
            }}
            
            h1 {{
                color: #1a56db;
                border-bottom: 3px solid #1a56db;
                padding-bottom: 10px;
                margin-top: 40px;
                font-size: 24pt;
                font-weight: 700;
            }}
            
            h2 {{
                color: #2563eb;
                margin-top: 30px;
                font-size: 18pt;
                font-weight: 600;
                border-left: 4px solid #2563eb;
                padding-left: 12px;
            }}
            
            h3 {{
                color: #4b5563;
                margin-top: 20px;
                font-size: 14pt;
                font-weight: 500;
            }}
            
            code {{
                background-color: #f3f4f6;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 10pt;
                color: #dc2626;
            }}
            
            pre {{
                background-color: #1f2937;
                color: #f3f4f6;
                padding: 15px;
                border-radius: 6px;
                overflow-x: auto;
                font-family: 'Courier New', monospace;
                font-size: 9pt;
                line-height: 1.5;
            }}
            
            pre code {{
                background-color: transparent;
                color: #f3f4f6;
                padding: 0;
            }}
            
            ul, ol {{
                margin-left: 20px;
                line-height: 2;
            }}
            
            li {{
                margin-bottom: 8px;
            }}
            
            strong {{
                font-weight: 600;
                color: #1f2937;
            }}
            
            em {{
                font-style: italic;
                color: #6b7280;
            }}
            
            blockquote {{
                border-left: 4px solid #d1d5db;
                padding-left: 15px;
                margin-left: 0;
                color: #6b7280;
                font-style: italic;
            }}
            
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 10pt;
            }}
            
            th {{
                background-color: #1f2937;
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: 600;
            }}
            
            td {{
                padding: 10px 12px;
                border-bottom: 1px solid #e5e7eb;
            }}
            
            tr:nth-child(even) {{
                background-color: #f9fafb;
            }}
            
            .badge {{
                display: inline-block;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 9pt;
                font-weight: 500;
                margin-right: 5px;
            }}
            
            .badge-success {{
                background-color: #dcfce7;
                color: #166534;
            }}
            
            .badge-info {{
                background-color: #dbeafe;
                color: #1e40af;
            }}
            
            .badge-warning {{
                background-color: #fef3c7;
                color: #92400e;
            }}
            
            .page-break {{
                page-break-after: always;
            }}
            
            @page {{
                size: A4;
                margin: 2cm;
                @bottom-right {{
                    content: counter(page);
                    font-size: 9pt;
                    color: #6b7280;
                }}
            }}
        </style>
    </head>
    <body>
"""
    
    # Simple markdown parsing (basic conversion)
    lines = md_content.split('\n')
    in_code_block = False
    code_lang = ''
    
    for line in lines:
        # Code blocks
        if line.startswith('```'):
            if not in_code_block:
                code_lang = line[3:].strip()
                html_content += '<pre><code>'
                in_code_block = True
            else:
                html_content += '</code></pre>\n'
                in_code_block = False
            continue
        
        if in_code_block:
            # Escape HTML in code blocks
            escaped = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            html_content += escaped + '\n'
            continue
        
        # Headers
        if line.startswith('# '):
            html_content += f'<h1>{line[2:]}</h1>\n'
        elif line.startswith('## '):
            html_content += f'<h2>{line[3:]}</h2>\n'
        elif line.startswith('### '):
            html_content += f'<h3>{line[4:]}</h3>\n'
        # Lists
        elif line.startswith('- ') or line.startswith('* '):
            if not html_content.endswith('</li>\n'):
                html_content += '<ul>\n'
            item = line[2:].strip()
            # Handle inline code
            item = item.replace('`', '<code>').replace('</code>', '</code>')
            # Handle bold
            import re
            item = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item)
            html_content += f'<li>{item}</li>\n'
        elif line.strip() == '' and html_content.endswith('</li>\n'):
            html_content += '</ul>\n'
        # Numbered lists
        elif line.strip() and line[0].isdigit() and '. ' in line:
            if not html_content.endswith('</li>\n') or '<ol>' not in html_content[-50:]:
                html_content += '<ol>\n'
            item = line.split('. ', 1)[1]
            import re
            item = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item)
            item = re.sub(r'`(.*?)`', r'<code>\1</code>', item)
            html_content += f'<li>{item}</li>\n'
        elif line.strip() == '' and html_content.endswith('</li>\n') and '<ol>' in html_content[-100:]:
            html_content += '</ol>\n'
        # Horizontal rule
        elif line.strip() in ['---', '***', '___']:
            html_content += '<hr class="page-break">\n'
        # Regular paragraph
        elif line.strip():
            # Handle inline formatting
            import re
            text = line
            text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
            text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
            text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', text)
            html_content += f'<p>{text}</p>\n'
    
    # Close any open lists
    if html_content.endswith('</li>\n'):
        html_content += '</ul>\n'
    
    html_content += """
    </body>
    </html>
    """
    
    # Write HTML for debugging
    html_file = md_file.replace('.md', '.html')
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"HTML file created: {html_file}")
    
    # Convert to PDF using WeasyPrint
    font_config = FontConfiguration()
    html = HTML(string=html_content, base_url='.')
    
    # Custom CSS for better Korean font rendering
    css = CSS(string='''
        @page {
            size: A4;
            margin: 2cm;
        }
    ''', font_config=font_config)
    
    html.write_pdf(output_pdf, font_config=font_config)
    print(f"PDF created: {output_pdf}")
    print(f"File size: {os.path.getsize(output_pdf) / 1024:.1f} KB")

if __name__ == '__main__':
    script_dir = Path(__file__).parent
    md_file = script_dir / 'FINAL_REPORT_KR.md'
    pdf_file = script_dir / 'FINAL_REPORT_KR.pdf'
    
    if not md_file.exists():
        print(f"Error: {md_file} not found")
        sys.exit(1)
    
    print(f"Converting {md_file} to PDF...")
    convert_md_to_pdf(str(md_file), str(pdf_file))
    print("✅ Conversion complete!")
