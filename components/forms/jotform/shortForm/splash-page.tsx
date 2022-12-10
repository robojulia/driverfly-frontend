import { useContext } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";

export function SplashPage() {
	const {
		state: { applicant },
		method: { stepNext }
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: {},
		onSubmit: (values) => {
			stepNext();
		},
	});

	return (
		<>
			<Form onSubmit={form.handleSubmit}>
				{/* Commenting this for not implementing translation  */}
				{/* <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
					<Dropdown>
						<Dropdown.Toggle variant="info" id="dropdown-basic">
							English
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item href="#/action-1">English</Dropdown.Item>
							<Dropdown.Item href="#/action-2">Spanish</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div> */}

				{/* Commenting this for not implementing translation  */}
				{/* <div
					style={{
						margin: "auto",
						position: "relative",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<span style={{ color: "#000" }}>Powered by</span>{" "}
					<img
						src="https://driverfly.co/img/DriverFly-Official-Favicon.png"
						alt="logo"
						height="80px"
					/>
				</div> */}

				<h1 className={styles.carrierName}>
					{t("{name}_carrier", { name: "Nautilus" }, { translateProps: true })}
				</h1>
				<h4 className={styles.Application}>{t("DRIVER_APPLICATION")}</h4>
				<h6 className={styles.paragraph}>{t("JOTFORM_WELCOME")}</h6>
				<Row className="mt-5 text-center">
					<Col>
						<Button type="submit">{t("NEXT")}</Button>
					</Col>
				</Row>
				<Row className="mt-5 col-9" style={{ margin: "auto" }}>
					<hr className={`${styles.highlight__black}`}></hr>
				</Row>
			</Form>
		</>
	);
}
