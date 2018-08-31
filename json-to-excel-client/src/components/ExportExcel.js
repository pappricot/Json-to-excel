import React from "react";

export default function ExportExcel(props) {
	return(
		<div className="export-excel">
			<input className="button"
				type="submit" 
				value="Export to Excel"
				onClick={props.exportExcel}
			/>
		</div>
	);
}