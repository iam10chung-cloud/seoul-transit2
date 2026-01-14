#!/usr/bin/env python3
"""
Convert FINAL_REPORT_KR.md to PDF using WeasyPrint
Handles Korean fonts properly with A4 format optimization
"""

import os
import sys
from pathlib import Path
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

def convert_md_to_pdf(md_file: str, output_pdf: str):
    """Convert Markdown to PDF with Korean font support and A4 formatting"""
    
    # Read markdown content
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML with professional A4 formatting
    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seoul Accessible Transit - 최종 개발 보고서</title>
        <style>
            @page {{
                size: A4;
                margin: 2.5cm 2cm 2.5cm 2cm;
                
                @top-center {{
                    content: "Seoul Accessible Transit - 최종 개발 보고서";
                    font-size: 9pt;
                    color: #6b7280;
                    font-family: 'Noto Sans KR', sans-serif;
                }}
                
                @bottom-right {{
                    content: counter(page) " / " counter(pages);
                    font-size: 9pt;
                    color: #6b7280;
                    font-family: 'Noto Sans KR', sans-serif;
                }}
            }}
            
            body {{
                font-family: 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
                line-height: 1.7;
                color: #1f2937;
                font-size: 10pt;
                margin: 0;
                padding: 0;
            }}
            
            /* Cover Page */
            .cover-page {{
                page-break-after: always;
                text-align: center;
                padding-top: 8cm;
            }}
            
            .cover-title {{
                font-size: 28pt;
                font-weight: 700;
                color: #1a56db;
                margin-bottom: 1cm;
            }}
            
            .cover-subtitle {{
                font-size: 16pt;
                color: #4b5563;
                margin-bottom: 2cm;
            }}
            
            .cover-info {{
                font-size: 11pt;
                color: #6b7280;
                line-height: 2;
            }}
            
            /* Headers */
            h1 {{
                color: #1a56db;
                border-bottom: 3px solid #1a56db;
                padding-bottom: 8px;
                margin-top: 1.5cm;
                margin-bottom: 0.8cm;
                font-size: 20pt;
                font-weight: 700;
                page-break-before: always;
            }}
            
            h1:first-of-type {{
                page-break-before: avoid;
            }}
            
            h2 {{
                color: #2563eb;
                margin-top: 0.8cm;
                margin-bottom: 0.4cm;
                font-size: 15pt;
                font-weight: 600;
                border-left: 4px solid #2563eb;
                padding-left: 10px;
            }}
            
            h3 {{
                color: #4b5563;
                margin-top: 0.6cm;
                margin-bottom: 0.3cm;
                font-size: 12pt;
                font-weight: 500;
            }}
            
            h4 {{
                color: #6b7280;
                margin-top: 0.4cm;
                margin-bottom: 0.2cm;
                font-size: 11pt;
                font-weight: 500;
            }}
            
            /* Paragraphs */
            p {{
                margin-bottom: 0.4cm;
                text-align: justify;
            }}
            
            /* Code blocks */
            code {{
                background-color: #f3f4f6;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', 'Consolas', monospace;
                font-size: 9pt;
                color: #dc2626;
                white-space: pre-wrap;
            }}
            
            pre {{
                background-color: #1f2937;
                color: #f3f4f6;
                padding: 12px;
                border-radius: 5px;
                overflow-x: auto;
                font-family: 'Courier New', 'Consolas', monospace;
                font-size: 8.5pt;
                line-height: 1.5;
                margin: 0.4cm 0;
                page-break-inside: avoid;
            }}
            
            pre code {{
                background-color: transparent;
                color: #f3f4f6;
                padding: 0;
            }}
            
            /* Lists */
            ul, ol {{
                margin-left: 0.8cm;
                margin-bottom: 0.4cm;
                line-height: 1.8;
            }}
            
            li {{
                margin-bottom: 0.2cm;
            }}
            
            ul ul, ol ol {{
                margin-top: 0.1cm;
                margin-bottom: 0.1cm;
            }}
            
            /* Text formatting */
            strong {{
                font-weight: 600;
                color: #111827;
            }}
            
            em {{
                font-style: italic;
                color: #4b5563;
            }}
            
            /* Blockquotes */
            blockquote {{
                border-left: 4px solid #d1d5db;
                padding-left: 12px;
                margin-left: 0;
                margin-right: 0;
                color: #4b5563;
                font-style: italic;
                margin-bottom: 0.4cm;
            }}
            
            /* Tables */
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 0.5cm 0;
                font-size: 9pt;
                page-break-inside: avoid;
            }}
            
            th {{
                background-color: #1f2937;
                color: white;
                padding: 8px 10px;
                text-align: left;
                font-weight: 600;
                border: 1px solid #374151;
            }}
            
            td {{
                padding: 8px 10px;
                border: 1px solid #e5e7eb;
                vertical-align: top;
            }}
            
            tr:nth-child(even) {{
                background-color: #f9fafb;
            }}
            
            /* Badges */
            .badge {{
                display: inline-block;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 8.5pt;
                font-weight: 500;
                margin-right: 4px;
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
            
            /* Info boxes */
            .info-box {{
                background-color: #eff6ff;
                border-left: 4px solid #2563eb;
                padding: 12px;
                margin: 0.4cm 0;
                border-radius: 4px;
                page-break-inside: avoid;
            }}
            
            .warning-box {{
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px;
                margin: 0.4cm 0;
                border-radius: 4px;
                page-break-inside: avoid;
            }}
            
            .success-box {{
                background-color: #dcfce7;
                border-left: 4px solid #16a34a;
                padding: 12px;
                margin: 0.4cm 0;
                border-radius: 4px;
                page-break-inside: avoid;
            }}
            
            /* Horizontal rules */
            hr {{
                border: none;
                border-top: 2px solid #e5e7eb;
                margin: 0.6cm 0;
            }}
            
            /* Links */
            a {{
                color: #2563eb;
                text-decoration: none;
            }}
            
            /* Page breaks */
            .page-break {{
                page-break-after: always;
            }}
            
            /* Table of contents */
            .toc {{
                margin: 1cm 0;
                padding: 0;
                list-style: none;
            }}
            
            .toc li {{
                margin-bottom: 0.3cm;
            }}
            
            .toc a {{
                color: #1f2937;
                text-decoration: none;
            }}
            
            /* Avoid breaks */
            h1, h2, h3, h4 {{
                page-break-after: avoid;
            }}
            
            pre, blockquote, table {{
                page-break-inside: avoid;
            }}
        </style>
    </head>
    <body>
        <div class="cover-page">
            <div class="cover-title">Seoul Accessible Transit</div>
            <div class="cover-subtitle">포괄적 접근성 플랫폼 개발 최종 보고서</div>
            <div class="cover-info">
                <p><strong>프로젝트명:</strong> Seoul Accessible Transit</p>
                <p><strong>버전:</strong> 1.0.0</p>
                <p><strong>작성일:</strong> 2026년 1월 14일</p>
                <p><strong>저장소:</strong> github.com/iam10chung-cloud/seoul-transit2</p>
                <p style="margin-top: 2cm; font-size: 9pt;">
                    이 보고서는 서울 대중교통의 접근성을 향상시키기 위한<br>
                    포괄적 플랫폼 개발 과정과 결과를 담고 있습니다.
                </p>
            </div>
        </div>
"""
    
    # Simple markdown parsing with improved formatting
    lines = md_content.split('\n')
    in_code_block = False
    in_list = False
    list_type = None
    
    for line in lines:
        # Skip title lines (already in cover)
        if line.startswith('# Seoul Accessible Transit'):
            continue
            
        # Code blocks
        if line.startswith('```'):
            if not in_code_block:
                html_content += '<pre><code>'
                in_code_block = True
            else:
                html_content += '</code></pre>\n'
                in_code_block = False
            continue
        
        if in_code_block:
            escaped = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
            html_content += escaped + '\n'
            continue
        
        # Headers
        if line.startswith('# '):
            if in_list:
                html_content += f'</{list_type}>\n'
                in_list = False
            html_content += f'<h1>{line[2:]}</h1>\n'
        elif line.startswith('## '):
            if in_list:
                html_content += f'</{list_type}>\n'
                in_list = False
            html_content += f'<h2>{line[3:]}</h2>\n'
        elif line.startswith('### '):
            if in_list:
                html_content += f'</{list_type}>\n'
                in_list = False
            html_content += f'<h3>{line[4:]}</h3>\n'
        elif line.startswith('#### '):
            if in_list:
                html_content += f'</{list_type}>\n'
                in_list = False
            html_content += f'<h4>{line[5:]}</h4>\n'
        # Lists
        elif line.startswith('- ') or line.startswith('* '):
            if not in_list:
                html_content += '<ul>\n'
                in_list = True
                list_type = 'ul'
            item = line[2:].strip()
            # Handle inline formatting
            import re
            item = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item)
            item = re.sub(r'`(.*?)`', r'<code>\1</code>', item)
            item = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', item)
            html_content += f'<li>{item}</li>\n'
        elif line.strip() and line[0].isdigit() and '. ' in line:
            if not in_list or list_type != 'ol':
                if in_list:
                    html_content += f'</{list_type}>\n'
                html_content += '<ol>\n'
                in_list = True
                list_type = 'ol'
            item = line.split('. ', 1)[1]
            import re
            item = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item)
            item = re.sub(r'`(.*?)`', r'<code>\1</code>', item)
            item = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', item)
            html_content += f'<li>{item}</li>\n'
        # Horizontal rule
        elif line.strip() in ['---', '***', '___']:
            if in_list:
                html_content += f'</{list_type}>\n'
                in_list = False
            html_content += '<hr>\n'
        # Empty line - close list if open
        elif line.strip() == '':
            if in_list:
                html_content += f'</{list_type}>\n'
                in_list = False
            else:
                html_content += '<br>\n'
        # Regular paragraph
        elif line.strip():
            if in_list and not (line.startswith('  ') or line.startswith('\t')):
                html_content += f'</{list_type}>\n'
                in_list = False
            
            # Don't create paragraph for indented list items
            if not (line.startswith('  ') or line.startswith('\t')):
                import re
                text = line
                text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
                text = re.sub(r'`(.*?)`', r'<code>\1</code>', text)
                text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', text)
                html_content += f'<p>{text}</p>\n'
    
    # Close any open lists
    if in_list:
        html_content += f'</{list_type}>\n'
    
    html_content += """
    </body>
    </html>
    """
    
    # Write HTML for debugging
    html_file = md_file.replace('.md', '_A4.html')
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ HTML file created: {html_file}")
    
    # Convert to PDF using WeasyPrint with A4 optimization
    font_config = FontConfiguration()
    html = HTML(string=html_content, base_url='.')
    
    # Write PDF
    html.write_pdf(output_pdf, font_config=font_config)
    
    file_size_kb = os.path.getsize(output_pdf) / 1024
    print(f"✅ PDF created: {output_pdf}")
    print(f"📄 File size: {file_size_kb:.1f} KB")
    print(f"📏 Format: A4 (210mm × 297mm)")
    print(f"📐 Margins: 2.5cm (top/bottom), 2cm (left/right)")

if __name__ == '__main__':
    script_dir = Path(__file__).parent
    md_file = script_dir / 'FINAL_REPORT_KR.md'
    pdf_file = script_dir / 'FINAL_REPORT_KR_A4.pdf'
    
    if not md_file.exists():
        print(f"❌ Error: {md_file} not found")
        sys.exit(1)
    
    print(f"🔄 Converting {md_file} to A4 PDF...")
    print("=" * 60)
    convert_md_to_pdf(str(md_file), str(pdf_file))
    print("=" * 60)
    print("✅ Conversion complete!")
    print(f"\n📥 Download the PDF from:")
    print(f"   {pdf_file}")
