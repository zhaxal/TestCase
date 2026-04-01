import { LightningElement, track } from "lwc";
import getOpportunitiesServer from "@salesforce/apex/OpportunityReportPageController.getOpportunitiesServer";

export default class OpportunityReport extends LightningElement {
  @track opportunities = [];

  budgetYear = "2026";
  showSpinner = false;
  stageValue = "";
  closeDateValue = "";
  opportunityText = "";
  defaultSortDirection = "asc";
  sortDirection = "asc";
  sortedBy;

  get stageOptions() {
    return [
      { label: "choose stage...", value: "" },
      { label: "Prospecting", value: "Prospecting" },
      { label: "Qualification", value: "Qualification" },
      { label: "Needs Analysis", value: "Needs Analysis" },
      { label: "Value Proposition", value: "Value Proposition" },
      { label: "Id. Decision Makers", value: "Id. Decision Makers" },
      { label: "Perception Analysis", value: "Perception Analysis" },
      { label: "Proposal/Price Quote", value: "Proposal/Price Quote" },
      { label: "Negotiation/Review", value: "Negotiation/Review" },
      { label: "Closed Won", value: "Closed Won" },
      { label: "Closed Lost", value: "Closed Lost" },
    ];
  }

  get yearOptions() {
    const currentYear = new Date().getFullYear();
    const options = [{ label: "All Years", value: "all" }];
    for (let i = -2; i <= 2; i++) {
      const year = (currentYear + i).toString();
      options.push({ label: year, value: year });
    }
    return options;
  }

  columns = [
    { label: "Name", fieldName: "Name", sortable: true },
    { label: "Fiscal Year", fieldName: "FiscalYear", sortable: true },
    { label: "Amount", fieldName: "Amount", type: "currency", sortable: true },
    { label: "Stage", fieldName: "StageName" },
    { label: "Description", fieldName: "Description" },
    { label: "Close Date", fieldName: "CloseDate" },
  ];

  connectedCallback() {
    this.doInit();
  }

  handleChange(event) {
    this.budgetYear = event.detail.value;
    this.doInit();
  }

  handleChangeStage(event) {
    this.stageValue = event.detail.value;
  }

  handleChangeCloseDate(event) {
    this.closeDateValue = event.detail.value;
  }

  handleFilter() {
    this.doInit();
  }

  clearFilters() {
    this.stageValue = "";
    this.closeDateValue = "";
    this.opportunityText = "";
    this.doInit();
  }

  handleSort(event) {
    this.sortedBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    const reverse = this.sortDirection === "desc";
    this.opportunities = [...this.opportunities].sort((a, b) => {
      const valA = a[this.sortedBy] ?? "";
      const valB = b[this.sortedBy] ?? "";
      return reverse
        ? valB > valA ? 1 : valB < valA ? -1 : 0
        : valA > valB ? 1 : valA < valB ? -1 : 0;
    });
  }

  async doInit() {
    try {
      this.showSpinner = true;
      const params = {
        budgetYear: this.budgetYear,
        stageName: this.stageValue,
        closeDate: this.closeDateValue,
      };
      this.opportunities = await getOpportunitiesServer({ params });
      this.opportunityText = `Total Opportunities: ${this.opportunities.length}`;
    } catch (e) {
      console.error(e);
    } finally {
      this.showSpinner = false;
    }
  }
}
