import React from 'react';

class HtmlTable extends React.Component {

    columnHeadings = ['Client', 'Type', 'Media', 'Market', 'ADI', 'Page', 'Hyperlink', 'Headline', 'Back Translation','Tone', 'Spokesperson Quote', 'Reporter', 'Visuals', 'Call to Actions']

    render() {
        return (
                <div className="htmlTable">
                    <table id="mytable">
                    <thead>
						<tr>
							<th></th>
							{this.columnHeadings.map((heading, index) => {
								console.log('heading', heading)
								return (
									
										<th key={index}>
										<span className="d-md-none">{heading}</span>
										</th>
									
								)}
							)}
						</tr>
					</thead>
                    <tr>
                                                    <td>WB</td>
                                                    <td>Online</td>
                                                    <td>8/8/18</td>
                                                    <td>wb</td>
                                                    <td>Language</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>https://wb.com</td>
                                                    <td>Harry Potter</td>
                                                    <td>First summarized paragraph</td>
                                                    <td>Positive</td>
                                                    <td>Rowling</td>
                                                    <td>Anya</td>
                                                    <td>Pictures, videos presence - yes</td>
                                                    <td>call to action</td>
                                                </tr>
                                                <tr>
                                                        <td>WB</td>
                                                        <td>Online</td>
                                                        <td>8/8/18</td>
                                                        <td>wb</td>
                                                        <td>Language</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>https://wb.com</td>
                                                        <td>Harry Potter</td>
                                                        <td>First summarized paragraph</td>
                                                        <td>Positive</td>
                                                        <td>Rowling</td>
                                                        <td>Anya</td>
                                                        <td>Pictures, videos presence - yes</td>
                                                        <td>call to action</td>
                                                </tr>
                                                </table>
                                <br />
                                <button id="button-a"><span>Create Excel &#8594;</span></button>
                     
                </div>
        )
    }
}

export default HtmlTable;